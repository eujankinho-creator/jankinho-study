(function () {
  "use strict";

  const desktopQuery =
    window.matchMedia(
      "(min-width: 1001px) and (pointer: fine)"
    );

  if (!desktopQuery.matches) {
    return;
  }

  const root =
    document.getElementById(
      "cortexVoiceAssistant"
    );

  if (!root) {
    return;
  }

  const orb =
    root.querySelector(
      ".cortex-voice-orb"
    );

  const panel =
    root.querySelector(
      ".cortex-voice-panel"
    );

  const closeButton =
    root.querySelector(
      ".cortex-voice-close"
    );

  const micButton =
    root.querySelector(
      ".cortex-voice-mic"
    );

  const sendButton =
    root.querySelector(
      ".cortex-voice-send"
    );

  const input =
    root.querySelector(
      ".cortex-voice-controls input"
    );

  const transcript =
    root.querySelector(
      ".cortex-voice-transcript"
    );

  const status =
    root.querySelector(
      ".cortex-voice-status"
    );

  const caption =
    root.querySelector(
      ".cortex-voice-caption strong"
    );

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  let recognition =
    null;

  let listening =
    false;

  let busy =
    false;

  const history = [];

  function setState(
    value,
    label
  ) {
    if (orb) {
      orb.dataset.state =
        value || "idle";
    }

    if (caption) {
      caption.textContent =
        label || "Cortex Voice";
    }
  }

  function setStatus(
    text
  ) {
    if (status) {
      status.textContent =
        text || "";
    }
  }

  function escapeHtml(
    value
  ) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function clearEmpty() {
    const empty =
      transcript &&
      transcript.querySelector(
        ".cortex-voice-empty"
      );

    if (empty) {
      empty.remove();
    }
  }

  function addMessage(
    role,
    text
  ) {
    if (!transcript) {
      return;
    }

    clearEmpty();

    const item =
      document.createElement(
        "div"
      );

    item.className =
      "cortex-voice-message " +
      role;

    item.innerHTML =
      escapeHtml(text);

    transcript.appendChild(
      item
    );

    transcript.scrollTop =
      transcript.scrollHeight;
  }

  function openPanel(
    startListening
  ) {
    if (!panel) {
      return;
    }

    panel.classList.add(
      "is-open"
    );

    panel.setAttribute(
      "aria-hidden",
      "false"
    );

    if (
      startListening &&
      recognition &&
      !listening &&
      !busy
    ) {
      window.setTimeout(
        startRecognition,
        120
      );
    }
  }

  function closePanel() {
    if (!panel) {
      return;
    }

    panel.classList.remove(
      "is-open"
    );

    panel.setAttribute(
      "aria-hidden",
      "true"
    );

    stopRecognition();

    if (
      window.speechSynthesis &&
      window.speechSynthesis.speaking
    ) {
      window.speechSynthesis.cancel();
    }

    setState(
      "idle",
      "Cortex Voice"
    );

    setStatus("");
  }

  function selectVoice() {
    if (!window.speechSynthesis) {
      return null;
    }

    const voices =
      window.speechSynthesis
        .getVoices();

    return (
      voices.find(function (voice) {
        return (
          /^pt-BR$/i.test(
            voice.lang
          )
        );
      }) ||
      voices.find(function (voice) {
        return (
          /^pt/i.test(
            voice.lang
          )
        );
      }) ||
      null
    );
  }

  function speak(
    text
  ) {
    if (
      !window.speechSynthesis ||
      !text
    ) {
      setState(
        "idle",
        "Cortex Voice"
      );

      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      "pt-BR";

    utterance.rate =
      1.02;

    utterance.pitch =
      .98;

    utterance.volume =
      1;

    const voice =
      selectVoice();

    if (voice) {
      utterance.voice =
        voice;
    }

    utterance.onstart =
      function () {
        setState(
          "speaking",
          "Falando"
        );

        setStatus(
          "Cortex está respondendo."
        );
      };

    utterance.onend =
      function () {
        setState(
          "idle",
          "Cortex Voice"
        );

        setStatus(
          "Clique na gosma ou no microfone para continuar."
        );
      };

    utterance.onerror =
      function () {
        setState(
          "idle",
          "Cortex Voice"
        );

        setStatus("");
      };

    window.speechSynthesis
      .speak(
        utterance
      );
  }

  async function sendMessage(
    raw
  ) {
    const message =
      String(raw || "")
        .trim()
        .slice(0, 1400);

    if (
      !message ||
      busy
    ) {
      return;
    }

    busy = true;

    stopRecognition();

    if (input) {
      input.value = "";
      input.disabled = true;
    }

    if (sendButton) {
      sendButton.disabled =
        true;
    }

    addMessage(
      "user",
      message
    );

    setState(
      "thinking",
      "Pensando"
    );

    setStatus(
      "Processando sua pergunta..."
    );

    try {
      const response =
        await fetch(
          "/api/voice-assistant",
          {
            method: "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                mensagem:
                  message,

                history:
                  history.slice(-8),
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data &&
          data.error
            ? data.error
            : "Falha ao consultar o assistente."
        );
      }

      const answer =
        String(
          data.resposta ||
          ""
        ).trim();

      if (!answer) {
        throw new Error(
          "O assistente não retornou uma resposta."
        );
      }

      history.push(
        {
          role: "user",
          content: message,
        },
        {
          role: "assistant",
          content: answer,
        }
      );

      while (
        history.length > 10
      ) {
        history.shift();
      }

      addMessage(
        "assistant",
        answer
      );

      speak(
        answer
      );
    }
    catch (error) {
      const messageText =
        error instanceof Error
          ? error.message
          : "Não foi possível responder agora.";

      addMessage(
        "assistant",
        messageText
      );

      setState(
        "idle",
        "Cortex Voice"
      );

      setStatus(
        "Tente novamente em instantes."
      );
    }
    finally {
      busy = false;

      if (input) {
        input.disabled = false;
        input.focus();
      }

      if (sendButton) {
        sendButton.disabled =
          false;
      }
    }
  }

  function stopRecognition() {
    if (
      !recognition ||
      !listening
    ) {
      return;
    }

    try {
      recognition.stop();
    }
    catch (error) {}

    listening = false;

    if (micButton) {
      micButton.classList.remove(
        "is-listening"
      );
    }
  }

  function startRecognition() {
    if (
      !recognition ||
      listening ||
      busy
    ) {
      return;
    }

    if (
      window.speechSynthesis &&
      window.speechSynthesis.speaking
    ) {
      window.speechSynthesis.cancel();
    }

    try {
      recognition.start();
    }
    catch (error) {}
  }

  if (SpeechRecognition) {
    recognition =
      new SpeechRecognition();

    recognition.lang =
      "pt-BR";

    recognition.interimResults =
      true;

    recognition.continuous =
      false;

    recognition.maxAlternatives =
      1;

    recognition.onstart =
      function () {
        listening = true;

        if (micButton) {
          micButton.classList.add(
            "is-listening"
          );
        }

        setState(
          "listening",
          "Ouvindo"
        );

        setStatus(
          "Pode falar."
        );
      };

    recognition.onresult =
      function (event) {
        let finalText = "";
        let interimText = "";

        for (
          let index =
            event.resultIndex;
          index <
            event.results.length;
          index += 1
        ) {
          const result =
            event.results[index];

          const text =
            result[0] &&
            result[0].transcript
              ? result[0].transcript
              : "";

          if (
            result.isFinal
          ) {
            finalText += text;
          }
          else {
            interimText += text;
          }
        }

        if (input) {
          input.value =
            finalText ||
            interimText;
        }

        if (finalText.trim()) {
          window.setTimeout(
            function () {
              sendMessage(
                finalText
              );
            },
            180
          );
        }
      };

    recognition.onerror =
      function (event) {
        listening = false;

        if (micButton) {
          micButton.classList.remove(
            "is-listening"
          );
        }

        setState(
          "idle",
          "Cortex Voice"
        );

        if (
          event &&
          event.error ===
            "not-allowed"
        ) {
          setStatus(
            "Permita o uso do microfone no navegador."
          );
        }
        else if (
          event &&
          event.error !==
            "no-speech"
        ) {
          setStatus(
            "Não consegui ouvir. Tente novamente."
          );
        }
      };

    recognition.onend =
      function () {
        listening = false;

        if (micButton) {
          micButton.classList.remove(
            "is-listening"
          );
        }

        if (!busy) {
          setState(
            "idle",
            "Cortex Voice"
          );
        }
      };
  }
  else if (panel) {
    panel.classList.add(
      "no-speech-recognition"
    );
  }

  if (orb) {
    orb.addEventListener(
      "click",
      function () {
        openPanel(
          true
        );
      }
    );
  }

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closePanel
    );
  }

  if (micButton) {
    micButton.addEventListener(
      "click",
      function () {
        if (listening) {
          stopRecognition();
        }
        else {
          startRecognition();
        }
      }
    );
  }

  if (sendButton) {
    sendButton.addEventListener(
      "click",
      function () {
        sendMessage(
          input &&
          input.value
        );
      }
    );
  }

  if (input) {
    input.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key ===
          "Enter"
        ) {
          event.preventDefault();

          sendMessage(
            input.value
          );
        }
      }
    );
  }

  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.key ===
          "Escape" &&
        panel &&
        panel.classList.contains(
          "is-open"
        )
      ) {
        closePanel();
      }
    }
  );

  window.addEventListener(
    "beforeunload",
    function () {
      stopRecognition();

      if (
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    }
  );
})();