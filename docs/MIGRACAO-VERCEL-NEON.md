# Migração do Córtex — Vercel + Neon

Esta branch prepara a versão **serverless** sem alterar o servidor contínuo atual nem
expor páginas autenticadas como HTML estático.

## Antes de mudar o banco
1. **Não desligue, exclua nem substitua o PostgreSQL antigo** sem guardar um backup.
   O código do GitHub não contém usuários, respostas, progresso ou flashcards do banco.
2. Se o banco Railway ainda estiver acessível, exporte um dump PostgreSQL completo
   com `pg_dump` usando a URL de conexão privada em ambiente seguro. Não envie
   credenciais, dumps com dados pessoais ou secrets para o GitHub.
3. Restaure no Neon com `pg_restore` (dump customizado) ou `psql` (dump SQL);
   confira usuários, questões, alternativas, respostas, histórico e flashcards.
4. Se o Railway não permitir acesso ao banco, investigue primeiro a recuperação
   no painel/suporte antes de criar contas em um banco vazio.

## Conectar Vercel
- Criar projeto no Vercel ligado a `eujankinho-creator/jankinho-study`.
- Usar inicialmente a branch de teste `migracao/vercel-neon`, root do projeto `.`.
- Preset: Other. As configurações de build e rotas estão em `vercel.json`.
- Variáveis de ambiente **em segredo no painel**:
  `DATABASE_URL` (conexão pooled PostgreSQL do Neon), `AUTH_SECRET`
  (reutilize o segredo existente para preservar cookies JWT), `NODE_ENV=production`.
  Acrescente somente as demais variáveis utilizadas pelos recursos ativados
  (como `YOUTUBE_API_KEY`, `OPENAI_API_KEY`) e nunca as inclua no repositório.
- Se usar dump PostgreSQL, **restaure antes de direcionar usuários** ao Vercel.
- Faça uma implantação de prévia e teste login, cadastro, questões, respostas,
  flashcards, aulas, temas, laboratórios e rotas autenticadas.
- Atualize o domínio somente após validar a aplicação e os dados.

## Servidor e importações
- O Vercel executa `api/index.ts` com a lógica de rotas original de
  `backend/src/server.ts`, mas **sem** iniciar `listen()` e sem executar
  importações automáticas em cold starts.
- O build publica CSS, JS, modelos e dados estáticos via CDN, mas os arquivos
  `.html` ficam exclusivamente no handler que valida a sessão.
- Para novos bancos vazios, execute `npx prisma db push` com URL direta do Neon
  em ambiente seguro, antes da primeira implantação. **Não use `db push` para
  substituir uma restauração de dados históricos.**
- Execute a importação oficial **uma única vez**, fora das Functions:
  `npm run questoes:importar-lote`, com credenciais do banco correto, após conferir
  os totais e as proteções de deduplicação. O processo precisa de acesso à pasta
  `backend/data/questoes-oficiais` e pode durar minutos.
- O script `npm run build:vercel` gera os assets e copia arquivos não HTML
  para `public/`. O `postinstall` atual ainda prepara recursos de ECG,
  Radiologia e Proteína G, podendo consumir bastante tempo/transferência
  no plano gratuito.

## Limitações/validação
- O Vercel Hobby tem limites de duração, invocações, build, processamento e
  uso exclusivamente pessoal/não comercial. Serviços de banco Neon gratuitos
  também têm limites de tamanho/processamento. Verifique as cotas atuais antes
  de disponibilizar a plataforma a muitos usuários.
- O servidor original não é alterado para o Railway/local. A branch só deve
  ser mesclada à branch principal quando os testes no Vercel passarem.
- Alguns fluxos de download/proxy, streaming e bibliotecas nativas ainda exigem
  validação prática em deploy de prévia; a existência do adaptador **não comprova
  que a migração já esteja funcionando em produção**.
