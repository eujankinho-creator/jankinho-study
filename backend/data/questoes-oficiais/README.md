# Importação massiva de questões oficiais do Córtex

O Córtex permite arquivos JSON de **até 1.000 questões por arquivo** e **vários arquivos em um único deploy**. Cada arquivo só é importado se estiver no formato `cortex-questoes-oficiais-v1`; é obrigatório indicar o **caderno original** e o **gabarito definitivo** da instituição.

Arquivos com a extensão `.example.json` são exemplos e não são importados.

A importação valida questão, alternativas, fontes, numeração e integridade antes de gravar, ignora enunciados/identificadores já presentes no banco e grava em transações de 150 questões com suas alternativas (sem deixar itens sem gabarito). Reexecutar não apaga respostas ou flashcards.

## Estrutura do arquivo

```json
{
  "formato": "cortex-questoes-oficiais-v1",
  "lote": "nome-do-lote",
  "provas": [{
    "codigo": "instituicao-ano-cargo-tipo1",
    "banca": "FGV",
    "ano": 2025,
    "orgao": "Nome do órgão",
    "cargo": "Nome do cargo - Tipo 1",
    "cadernoUrl": "https://dominio-oficial/prova.pdf",
    "gabaritoUrl": "https://dominio-oficial/gabarito-definitivo.pdf",
    "gabaritoDefinitivo": true,
    "questoes": [{
      "numero": 1,
      "disciplina": "Enfermagem",
      "assunto": "Imunização",
      "enunciado": "Transcrição integral autorizada e conferida do enunciado oficial...",
      "alternativas": ["Primeira alternativa", "Segunda alternativa", "Terceira alternativa", "Quarta alternativa", "Quinta alternativa"],
      "correta": "C"
    }]
  }]
}
```

O exemplo acima é apenas uma **descrição de formato**, não uma questão real e não deve ser importado. Nunca preencher com questões inventadas, questões anuladas ou gabaritos preliminares. Garantir que a reprodução integral de provas de terceiros seja autorizada. Quando houver figuras indispensáveis, fornecer `imagemUrl` e `imagemAlt`.

**Execução:** o startup do backend procura os manifestos novos e importa os inéditos. Também existe o comando `npm run questoes:importar-lote`. A meta editorial é 9.000 questões no acervo, preservando pelo menos 30 questões oficiais por assunto.
