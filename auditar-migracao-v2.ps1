$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$saida = Join-Path $root "auditoria-migracao.txt"

$utf8 = New-Object System.Text.UTF8Encoding -ArgumentList $false

$linhas = New-Object System.Collections.Generic.List[string]


function Add-Line {
    param(
        [string]$Text = ""
    )

    Write-Host $Text
    [void]$script:linhas.Add($Text)
}


function Add-Section {
    param(
        [string]$Title
    )

    Add-Line ""
    Add-Line "============================================================"
    Add-Line $Title
    Add-Line "============================================================"
}


function Check-Path {
    param(
        [string]$Path
    )

    if (Test-Path $Path) {
        Add-Line "[OK] $Path"
    }
    else {
        Add-Line "[FALTA] $Path"
    }
}


function Get-RelativeName {
    param(
        [string]$Path
    )

    if (
        $Path.StartsWith(
            $script:root,
            [System.StringComparison]::OrdinalIgnoreCase
        )
    ) {

        return $Path.Substring(
            $script:root.Length
        ).TrimStart("\")
    }

    return $Path
}


Add-Line "JANKINHO STUDY - AUDITORIA FINAL"
Add-Line ("Data: {0}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"))


# ============================================================
# 1. GIT
# ============================================================

Add-Section "1. GIT"


try {

    $branch = git branch --show-current 2>$null

    Add-Line ("Branch: {0}" -f $branch)


    $status = git status --short 2>$null


    if ($status) {

        Add-Line ""
        Add-Line "Arquivos pendentes:"


        foreach ($item in $status) {
            Add-Line ("  {0}" -f $item)
        }

    }
    else {

        Add-Line "[OK] Working tree limpa."
    }

}
catch {

    Add-Line "[ERRO] Nao foi possivel consultar o Git."
}


# ============================================================
# 2. PAGINAS HTML
# ============================================================

Add-Section "2. PAGINAS HTML MIGRADAS"


$pages = @(
    "frontend\index.html",
    "frontend\login.html",
    "frontend\cadastro.html",
    "frontend\questoes.html",
    "frontend\flashcards.html",
    "frontend\financas.html",
    "frontend\casos.html",
    "frontend\caso.html",
    "frontend\laboratorio.html",
    "frontend\evolucao.html",
    "frontend\desempenho.html",
    "frontend\ranking.html",
    "frontend\configuracoes.html"
)


foreach ($page in $pages) {
    Check-Path $page
}


# ============================================================
# 3. BACKEND
# ============================================================

Add-Section "3. BACKEND TYPESCRIPT"


$backendFiles = @(
    "backend\src\server.ts",
    "backend\src\iaQuestoes.ts",
    "backend\src\flashcards.ts",
    "backend\src\casos.ts",
    "backend\src\casosDetalhe.ts",
    "backend\src\desempenho.ts",
    "backend\src\ranking.ts",
    "backend\src\configuracoes.ts"
)


foreach ($file in $backendFiles) {
    Check-Path $file
}


# ============================================================
# 4. LEGADO
# ============================================================

Add-Section "4. ARQUIVOS E PASTAS POSSIVELMENTE LEGADOS"


$legacyPaths = @(
    "app",
    "components",
    ".next",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "postcss.config.js",
    "postcss.config.mjs",
    "postcss.config.cjs",
    "tailwind.config.js",
    "tailwind.config.ts",
    "eslint.config.mjs"
)


foreach ($item in $legacyPaths) {

    if (Test-Path $item) {
        Add-Line ("[EXISTE] {0}" -f $item)
    }
    else {
        Add-Line ("[NAO EXISTE] {0}" -f $item)
    }
}


# ============================================================
# 5. PACKAGE.JSON
# ============================================================

Add-Section "5. PACKAGE.JSON"


if (Test-Path "package.json") {

    try {

        $package = Get-Content `
            "package.json" `
            -Raw |
            ConvertFrom-Json


        $dependencies = @()
        $devDependencies = @()


        if ($package.dependencies) {

            $dependencies =
                $package.dependencies.
                PSObject.Properties.Name
        }


        if ($package.devDependencies) {

            $devDependencies =
                $package.devDependencies.
                PSObject.Properties.Name
        }


        Add-Line "Dependencies:"


        foreach ($dep in ($dependencies | Sort-Object)) {
            Add-Line ("  {0}" -f $dep)
        }


        Add-Line ""
        Add-Line "DevDependencies:"


        foreach ($dep in ($devDependencies | Sort-Object)) {
            Add-Line ("  {0}" -f $dep)
        }


        Add-Line ""
        Add-Line "Possiveis dependencias legadas:"


        $legacyDeps = @(
            "next",
            "react",
            "react-dom",
            "recharts",
            "three",
            "@types/react",
            "@types/react-dom",
            "@types/three",
            "@tailwindcss/postcss",
            "tailwindcss",
            "eslint-config-next"
        )


        $foundLegacy = $false


        foreach ($dep in $legacyDeps) {

            if (
                $dependencies -contains $dep -or
                $devDependencies -contains $dep
            ) {

                Add-Line ("  [VERIFICAR] {0}" -f $dep)
                $foundLegacy = $true
            }
        }


        if (-not $foundLegacy) {
            Add-Line "  Nenhuma encontrada."
        }

    }
    catch {

        Add-Line "[ERRO] package.json nao pode ser interpretado."
        Add-Line $_.Exception.Message
    }

}
else {

    Add-Line "[FALTA] package.json"
}


# ============================================================
# 6. CODIGO PARA ANALISE
# ============================================================

Add-Section "6. REFERENCIAS NEXT REACT TAILWIND"


$codeFiles = @()

$folders = @(
    "frontend",
    "backend",
    "app",
    "components",
    "lib",
    "scripts"
)


foreach ($folder in $folders) {

    if (-not (Test-Path $folder)) {
        continue
    }


    $codeFiles += Get-ChildItem `
        -Path $folder `
        -Recurse `
        -File `
        -ErrorAction SilentlyContinue |
        Where-Object {

            $_.Extension -in @(
                ".js",
                ".jsx",
                ".ts",
                ".tsx",
                ".css",
                ".html"
            )
        }
}


$legacyTerms = @(
    'from "next',
    "from 'next",
    'from "react',
    "from 'react",
    "react-dom",
    "recharts",
    "@tailwind",
    "tailwindcss",
    "next/"
)


$legacyMatches = @()


foreach ($file in $codeFiles) {

    foreach ($term in $legacyTerms) {

        $match = Select-String `
            -Path $file.FullName `
            -Pattern $term `
            -SimpleMatch `
            -ErrorAction SilentlyContinue


        if ($match) {
            $legacyMatches += $match
        }
    }
}


if ($legacyMatches.Count -eq 0) {

    Add-Line "[OK] Nenhuma referencia encontrada."

}
else {

    $legacyMatches =
        $legacyMatches |
        Sort-Object Path,LineNumber -Unique


    foreach ($item in $legacyMatches) {

        $relative =
            Get-RelativeName $item.Path


        Add-Line (
            "{0}:{1}" -f
            $relative,
            $item.LineNumber
        )

        Add-Line (
            "  {0}" -f
            $item.Line.Trim()
        )
    }
}


# ============================================================
# 7. ANATOMIA E RELATORIOS
# ============================================================

Add-Section "7. REFERENCIAS REMOVIDAS"


$removedTerms = @(
    "/anatomia",
    "Anatomia 3D",
    "/relatorios",
    "Relatorios"
)


$removedMatches = @()


foreach ($file in $codeFiles) {

    foreach ($term in $removedTerms) {

        $match = Select-String `
            -Path $file.FullName `
            -Pattern $term `
            -SimpleMatch `
            -ErrorAction SilentlyContinue


        if ($match) {
            $removedMatches += $match
        }
    }
}


if ($removedMatches.Count -eq 0) {

    Add-Line "[OK] Nenhuma referencia encontrada."

}
else {

    $removedMatches =
        $removedMatches |
        Sort-Object Path,LineNumber -Unique


    foreach ($item in $removedMatches) {

        $relative =
            Get-RelativeName $item.Path


        Add-Line (
            "[RESTO] {0}:{1}" -f
            $relative,
            $item.LineNumber
        )

        Add-Line (
            "  {0}" -f
            $item.Line.Trim()
        )
    }
}


# ============================================================
# 8. SERVER
# ============================================================

Add-Section "8. ROTAS DO SERVER"


$serverPath =
    "backend\src\server.ts"


if (Test-Path $serverPath) {

    $server =
        Get-Content `
            $serverPath `
            -Raw


    $expectedRoutes = @(
        "/health",
        "/questoes",
        "/flashcards",
        "/financas",
        "/casos",
        "/laboratorio",
        "/evolucao",
        "/desempenho",
        "/ranking",
        "/configuracoes"
    )


    foreach ($route in $expectedRoutes) {

        if (
            $server.Contains(
                '"' + $route + '"'
            )
        ) {

            Add-Line ("[OK] {0}" -f $route)

        }
        else {

            Add-Line ("[VERIFICAR] {0}" -f $route)
        }
    }


    Add-Line ""
    Add-Line "Rotas que deveriam estar removidas:"


    $removedRoutes = @(
        "/anatomia",
        "/relatorios"
    )


    foreach ($route in $removedRoutes) {

        if (
            $server.Contains(
                '"' + $route + '"'
            )
        ) {

            Add-Line (
                "[AINDA EXISTE] {0}" -f
                $route
            )

        }
        else {

            Add-Line (
                "[OK REMOVIDA] {0}" -f
                $route
            )
        }
    }

}
else {

    Add-Line "[FALTA] backend/src/server.ts"
}


# ============================================================
# 9. PORTA 3002
# ============================================================

Add-Section "9. SERVIDOR LOCAL"


$listener = Get-NetTCPConnection `
    -LocalPort 3002 `
    -State Listen `
    -ErrorAction SilentlyContinue


if ($listener) {

    Add-Line "[OK] Porta 3002 ativa."


    try {

        $health = Invoke-WebRequest `
            "http://localhost:3002/health" `
            -UseBasicParsing `
            -TimeoutSec 5


        Add-Line (
            "[OK] /health HTTP {0}" -f
            $health.StatusCode
        )


        Add-Line (
            "Resposta: {0}" -f
            $health.Content
        )

    }
    catch {

        Add-Line "[ERRO] /health falhou."

        Add-Line (
            "  {0}" -f
            $_.Exception.Message
        )
    }

}
else {

    Add-Line "[INFO] Porta 3002 nao esta ativa."
}


# ============================================================
# 10. SCRIPTS PS1
# ============================================================

Add-Section "10. SCRIPTS TEMPORARIOS"


$psScripts = Get-ChildItem `
    -Path "." `
    -Filter "*.ps1" `
    -File `
    -ErrorAction SilentlyContinue


if ($psScripts.Count -eq 0) {

    Add-Line "Nenhum script PS1 encontrado."

}
else {

    foreach ($file in $psScripts) {
        Add-Line ("  {0}" -f $file.Name)
    }
}


# ============================================================
# 11. RAIZ
# ============================================================

Add-Section "11. ESTRUTURA DA RAIZ"


$items = Get-ChildItem `
    -Path "." `
    -Force `
    -ErrorAction SilentlyContinue |
    Where-Object {

        $_.Name -notin @(
            ".git",
            "node_modules",
            ".next"
        )
    } |
    Sort-Object Name


foreach ($item in $items) {

    if ($item.PSIsContainer) {

        Add-Line (
            "[DIR]  {0}" -f
            $item.Name
        )

    }
    else {

        Add-Line (
            "[FILE] {0}" -f
            $item.Name
        )
    }
}


# ============================================================
# 12. FINAL
# ============================================================

Add-Section "AUDITORIA CONCLUIDA"

Add-Line "Nenhum arquivo do projeto foi apagado."
Add-Line "Nenhuma dependencia foi removida."
Add-Line ""
Add-Line "Resultado salvo em:"
Add-Line "auditoria-migracao.txt"


$text =
    $linhas -join
    [Environment]::NewLine


[System.IO.File]::WriteAllText(
    $saida,
    $text,
    $utf8
)


Write-Host ""
Write-Host "Para visualizar:"
Write-Host ""
Write-Host "Get-Content .\auditoria-migracao.txt"
Write-Host ""