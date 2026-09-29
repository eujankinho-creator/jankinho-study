$ErrorActionPreference = "Stop"

$saida = "auditoria-migracao.txt"

$linhas = New-Object System.Collections.Generic.List[string]


function Linha {
    param(
        [string]$Texto = ""
    )

    Write-Host $Texto

    $script:linhas.Add(
        $Texto
    )
}


function Titulo {
    param(
        [string]$Texto
    )

    Linha ""
    Linha "============================================================"
    Linha $Texto
    Linha "============================================================"
}


function Existe {
    param(
        [string]$Caminho
    )

    if (Test-Path $Caminho) {
        Linha "[OK] $Caminho"
    }
    else {
        Linha "[FALTA] $Caminho"
    }
}


Linha "JANKINHO STUDY - AUDITORIA FINAL DA MIGRACAO"
Linha "Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"


# ============================================================
# GIT
# ============================================================

Titulo "1. GIT"

try {

    $branch = git branch --show-current 2>$null

    Linha "Branch: $branch"

    $status = git status --short 2>$null

    if ($status) {

        Linha ""
        Linha "Arquivos pendentes:"

        foreach ($item in $status) {
            Linha "  $item"
        }

    }
    else {

        Linha "Working tree limpa."
    }

}
catch {

    Linha "[ERRO] Nao foi possivel consultar o Git."
}


# ============================================================
# ARQUIVOS MIGRADOS
# ============================================================

Titulo "2. PAGINAS MIGRADAS"

$paginas = @(
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


foreach ($pagina in $paginas) {
    Existe $pagina
}


# ============================================================
# BACKEND
# ============================================================

Titulo "3. BACKEND TYPESCRIPT"

$backendArquivos = @(
    "backend\src\server.ts",
    "backend\src\iaQuestoes.ts",
    "backend\src\flashcards.ts",
    "backend\src\casos.ts",
    "backend\src\casosDetalhe.ts",
    "backend\src\desempenho.ts",
    "backend\src\ranking.ts",
    "backend\src\configuracoes.ts"
)


foreach ($arquivo in $backendArquivos) {
    Existe $arquivo
}


# ============================================================
# ARQUIVOS LEGADOS
# ============================================================

Titulo "4. POSSIVEIS ARQUIVOS LEGADOS"

$legados = @(
    "app",
    "components",
    ".next",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "postcss.config.js",
    "postcss.config.mjs",
    "tailwind.config.js",
    "tailwind.config.ts",
    "eslint.config.mjs"
)


foreach ($item in $legados) {

    if (Test-Path $item) {

        Linha "[EXISTE] $item"

    }
    else {

        Linha "[NAO EXISTE] $item"
    }
}


# ============================================================
# PACKAGE.JSON
# ============================================================

Titulo "5. DEPENDENCIAS DO PACKAGE.JSON"

if (Test-Path "package.json") {

    try {

        $package =
            Get-Content `
                "package.json" `
                -Raw |
            ConvertFrom-Json


        $dependencias = @()

        if ($package.dependencies) {

            $dependencias +=
                $package.dependencies.
                    PSObject.Properties.Name
        }


        $devDependencias = @()

        if ($package.devDependencies) {

            $devDependencias +=
                $package.devDependencies.
                    PSObject.Properties.Name
        }


        Linha "Dependencies:"

        foreach (
            $dep in
            ($dependencias | Sort-Object)
        ) {

            Linha "  $dep"
        }


        Linha ""
        Linha "DevDependencies:"

        foreach (
            $dep in
            ($devDependencias | Sort-Object)
        ) {

            Linha "  $dep"
        }


        $candidatas = @(
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


        Linha ""
        Linha "Dependencias possivelmente legadas:"


        $encontrou = $false


        foreach ($dep in $candidatas) {

            if (
                $dependencias -contains $dep -or
                $devDependencias -contains $dep
            ) {

                Linha "  [LEGADO?] $dep"

                $encontrou = $true
            }
        }


        if (-not $encontrou) {

            Linha "  Nenhuma das dependencias legadas conhecidas."
        }

    }
    catch {

        Linha "[ERRO] Nao consegui interpretar package.json."
    }

}
else {

    Linha "[FALTA] package.json"
}


# ============================================================
# REFERENCIAS NEXT / REACT
# ============================================================

Titulo "6. REFERENCIAS A NEXT / REACT / TAILWIND"

$arquivosCodigo = @()


$pastasPesquisa = @(
    "frontend",
    "backend",
    "app",
    "components",
    "lib",
    "scripts"
)


foreach ($pasta in $pastasPesquisa) {

    if (Test-Path $pasta) {

        $arquivosCodigo +=
            Get-ChildItem `
                -Path $pasta `
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
}


$termosLegacy = @(
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


$resultadosLegacy = @()


foreach ($arquivo in $arquivosCodigo) {

    foreach ($termo in $termosLegacy) {

        $match =
            Select-String `
                -Path $arquivo.FullName `
                -Pattern $termo `
                -SimpleMatch `
                -ErrorAction SilentlyContinue


        if ($match) {

            $resultadosLegacy +=
                $match
        }
    }
}


if ($resultadosLegacy.Count -eq 0) {

    Linha "Nenhuma referencia encontrada."

}
else {

    $unicos =
        $resultadosLegacy |
        Sort-Object Path,LineNumber -Unique


    foreach ($item in $unicos) {

        $relativo =
            Resolve-Path `
                -Relative `
                $item.Path


        Linha "$relativo:$($item.LineNumber)"
        Linha "  $($item.Line.Trim())"
    }
}


# ============================================================
# ANATOMIA / RELATORIOS
# ============================================================

Titulo "7. REFERENCIAS QUE JA DEVERIAM TER SIDO REMOVIDAS"

$termosRemovidos = @(
    "/anatomia",
    "Anatomia 3D",
    "/relatorios",
    "Relatorios",
    "Relatórios"
)


$resultadosRemovidos = @()


foreach ($arquivo in $arquivosCodigo) {

    foreach ($termo in $termosRemovidos) {

        $match =
            Select-String `
                -Path $arquivo.FullName `
                -Pattern $termo `
                -SimpleMatch `
                -ErrorAction SilentlyContinue


        if ($match) {

            $resultadosRemovidos +=
                $match
        }
    }
}


if ($resultadosRemovidos.Count -eq 0) {

    Linha "[OK] Nenhuma referencia encontrada."

}
else {

    $unicos =
        $resultadosRemovidos |
        Sort-Object Path,LineNumber -Unique


    foreach ($item in $unicos) {

        $relativo =
            Resolve-Path `
                -Relative `
                $item.Path


        Linha "[RESTO] $relativo:$($item.LineNumber)"
        Linha "  $($item.Line.Trim())"
    }
}


# ============================================================
# SERVER
# ============================================================

Titulo "8. ROTAS PRESENTES NO SERVER.TS"

$serverPath =
    "backend\src\server.ts"


if (Test-Path $serverPath) {

    $server =
        Get-Content `
            $serverPath `
            -Raw


    $rotasEsperadas = @(
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


    foreach ($rota in $rotasEsperadas) {

        if (
            $server.Contains(
                "`"$rota`""
            )
        ) {

            Linha "[OK] $rota"

        }
        else {

            Linha "[VERIFICAR] $rota"
        }
    }


    Linha ""
    Linha "Rotas removidas:"


    foreach (
        $rota in
        @(
            "/anatomia",
            "/relatorios"
        )
    ) {

        if (
            $server.Contains(
                "`"$rota`""
            )
        ) {

            Linha "[AINDA EXISTE] $rota"

        }
        else {

            Linha "[OK REMOVIDA] $rota"
        }
    }

}
else {

    Linha "[FALTA] backend/src/server.ts"
}


# ============================================================
# TESTE DA PORTA 3002
# ============================================================

Titulo "9. SERVIDOR LOCAL"

$portaAtiva =
    Get-NetTCPConnection `
        -LocalPort 3002 `
        -State Listen `
        -ErrorAction SilentlyContinue


if ($portaAtiva) {

    Linha "[OK] Porta 3002 ativa."


    try {

        $health =
            Invoke-WebRequest `
                "http://localhost:3002/health" `
                -UseBasicParsing `
                -TimeoutSec 5


        Linha "[OK] /health HTTP $($health.StatusCode)"
        Linha "Resposta: $($health.Content)"

    }
    catch {

        Linha "[ERRO] Porta ativa, mas /health falhou."
        Linha "  $($_.Exception.Message)"
    }

}
else {

    Linha "[INFO] Porta 3002 nao esta rodando."
}


# ============================================================
# ARQUIVOS PS1 TEMPORARIOS
# ============================================================

Titulo "10. SCRIPTS TEMPORARIOS"

$ps1 =
    Get-ChildItem `
        -Path "." `
        -Filter "*.ps1" `
        -File `
        -ErrorAction SilentlyContinue


if (
    -not $ps1 -or
    $ps1.Count -eq 0
) {

    Linha "Nenhum script .ps1 temporario encontrado."

}
else {

    foreach ($arquivo in $ps1) {

        Linha "  $($arquivo.Name)"
    }
}


# ============================================================
# ESTRUTURA RAIZ
# ============================================================

Titulo "11. ESTRUTURA DA RAIZ"

$raiz =
    Get-ChildItem `
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
    Sort-Object `
        @{Expression="PSIsContainer";Descending=$true},
        Name


foreach ($item in $raiz) {

    if ($item.PSIsContainer) {

        Linha "[DIR]  $($item.Name)"

    }
    else {

        Linha "[FILE] $($item.Name)"
    }
}


# ============================================================
# RESULTADO
# ============================================================

Titulo "AUDITORIA CONCLUIDA"

Linha "Nenhum arquivo foi apagado ou alterado."
Linha ""
Linha "Arquivo gerado:"
Linha "  $saida"


[System.IO.File]::WriteAllLines(
    (Join-Path (Get-Location) $saida),
    $linhas,
    (
        New-Object
        System.Text.UTF8Encoding($false)
    )
)


Write-Host ""
Write-Host "Para mostrar o resultado completo:"
Write-Host ""
Write-Host "Get-Content .\auditoria-migracao.txt"
Write-Host ""