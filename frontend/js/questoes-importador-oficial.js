/* Importador de provas originais fornecidas pela conta proprietária do Córtex. */
(() => {
  "use strict";
  const section = document.getElementById("importadorOficialPanel");
  const form = document.getElementById("formImportarProvas");
  const file = document.getElementById("arquivoQuestoesManifesto");
  const confirmRights = document.getElementById("confirmacaoDireitosQuestoes");
  const confirmKey = document.getElementById("confirmacaoGabaritoQuestoes");
  const button = document.getElementById("botaoImportacaoQuestoes");
  const output = document.getElementById("resultadoImportacaoQuestoes");
  if (!section || !form || !file || !button || !output) return;
  fetch("/api/questoes/importar-lote/status", { credentials: "same-origin" })
    .then(r => r.ok ? r.json() : null)
    .then(data => { if (data?.permitido) section.hidden = false; })
    .catch(() => {});
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const documentFile = file.files?.[0];
    if (!documentFile || !confirmRights.checked || !confirmKey.checked) {
      output.textContent = "Selecione o arquivo e confirme os dois requisitos.";
      return;
    }
    if (documentFile.size > 10_000_000) {
      output.textContent = "Arquivo maior que 10 MB. Divida em lotes menores.";
      return;
    }
    button.disabled = true;
    output.textContent = "Conferindo questões, fontes e duplicatas...";
    try {
      const manifesto = JSON.parse(await documentFile.text());
      const resp = await fetch("/api/questoes/importar-lote", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manifesto, confirmoDireitos: true, confirmeiGabarito: true,
        }),
      });
      const resultado = await resp.json();
      if (!resp.ok) throw new Error(resultado.error || "Não foi possível importar.");
      output.textContent = [
        "Importação concluída.",
        "Novas questões: " + resultado.inseridas,
        "Já importadas: " + resultado.jaImportadas,
        "Repetidas ignoradas: " + resultado.repetidas,
        "Transações: " + resultado.transacoes,
      ].join("\n");
      window.dispatchEvent(new Event("cortex:questoes-atualizadas"));
    } catch (error) {
      output.textContent = "Erro: " + (error?.message || String(error));
    } finally {
      button.disabled = false;
    }
  });
})();