(() => {
  class VoiceController {
    constructor({ onTranscript, onListeningChange, onSpeakingChange }) {
      this.onTranscript = onTranscript;
      this.onListeningChange = onListeningChange;
      this.onSpeakingChange = onSpeakingChange;
      this.enabled = true;
      this.recognition = null;
      this.initRecognition();
    }

    initRecognition() {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) return;
      this.recognition = new Recognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => this.onListeningChange(true);
      this.recognition.onend = () => this.onListeningChange(false);
      this.recognition.onerror = () => this.onListeningChange(false);
      this.recognition.onresult = (event) => {
        const text = event.results?.[0]?.[0]?.transcript?.trim();
        if (text) this.onTranscript(text);
      };
    }

    startListening() {
      if (this.recognition) this.recognition.start();
    }

    stopListening() {
      if (this.recognition) this.recognition.stop();
    }

    toggleVoice() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    speak(text) {
      if (!this.enabled || !('speechSynthesis' in window)) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => this.onSpeakingChange(true);
      utterance.onend = () => this.onSpeakingChange(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }

  window.VoiceController = VoiceController;
})();
