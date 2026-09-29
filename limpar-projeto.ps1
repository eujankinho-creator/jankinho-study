git checkout -b cleanup/pre-migracao

# Arquivos/pastas de ferramentas e backups que não fazem parte do site
git rm -r --ignore-unmatch .agents
git rm -r --ignore-unmatch .claude
git rm -r --ignore-unmatch .cursor
git rm -r --ignore-unmatch .devin
git rm -r --ignore-unmatch _backup-casos

git rm --ignore-unmatch AGENTS.md
git rm --ignore-unmatch CLAUDE.md

# Arquivos de diagnóstico
git rm --ignore-unmatch busca-textura.txt
git rm --ignore-unmatch resultado.txt

# Assets padrão do Next não utilizados
git rm --ignore-unmatch public/file.svg
git rm --ignore-unmatch public/globe.svg
git rm --ignore-unmatch public/next.svg
git rm --ignore-unmatch public/vercel.svg
git rm --ignore-unmatch public/window.svg

# Prisma Client é gerado automaticamente
git rm -r --cached --ignore-unmatch src/generated

if (Test-Path "src/generated") {
    Remove-Item "src/generated" -Recurse -Force
}

# Builds/caches locais
$pastas = @(
    ".next",
    "out",
    "build",
    "dist",
    "coverage",
    ".cache"
)

foreach ($pasta in $pastas) {
    if (Test-Path $pasta) {
        Remove-Item $pasta -Recurse -Force
    }
}

Get-ChildItem -Recurse -Filter "*.tsbuildinfo" -ErrorAction SilentlyContinue |
    Remove-Item -Force

# Atualiza .gitignore
$ignorar = @"

# generated
/src/generated/
/dist/
/.cache/

# local tooling
/.agents/
/.claude/
/.cursor/
/.devin/

# temporary/debug
*.log
resultado.txt
busca-textura.txt
"@

Add-Content ".gitignore" $ignorar

# Reinstala e recria somente o que o projeto precisa
npm install
npm run build