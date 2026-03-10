(() => {
  const state = {
    currentCategory: 'Critical Thinking',
    thinkMode: false,
    askAnythingMode: false,
    streak: 0,
    insight: 0,
    curiosity: 20,
    reflection: 10,
    thinkStep: 0,
    thinkFlow: [
      'What is the real question beneath your question?',
      'What assumptions are you currently making?',
      'What evidence supports and challenges your view?',
      'What alternative explanation deserves attention?',
      'What next action would test your thinking safely?'
    ]
  };

  const ui = {
    landing: document.getElementById('landing'),
    beginBtn: document.getElementById('beginBtn'),
    app: document.getElementById('app'),
    chatHistory: document.getElementById('chatHistory'),
    typingIndicator: document.getElementById('typingIndicator'),
    userInput: document.getElementById('userInput'),
    sendBtn: document.getElementById('sendBtn'),
    voiceInputBtn: document.getElementById('voiceInputBtn'),
    categoryTabs: document.getElementById('categoryTabs'),
    suggestions: document.getElementById('suggestions'),
    thinkModeBtn: document.getElementById('thinkModeBtn'),
    askAnythingBtn: document.getElementById('askAnythingBtn'),
    startListeningBtn: document.getElementById('startListeningBtn'),
    stopListeningBtn: document.getElementById('stopListeningBtn'),
    toggleVoiceBtn: document.getElementById('toggleVoiceBtn'),
    streak: document.getElementById('streak'),
    insightPoints: document.getElementById('insightPoints'),
    curiosityMeter: document.getElementById('curiosityMeter'),
    reflectionBar: document.getElementById('reflectionBar'),
    reflectionValue: document.getElementById('reflectionValue')
  };

  const avatar = new window.CogniAvatar('avatarCanvas', 'avatarStatus');
  const voice = new window.VoiceController({
    onTranscript: (text) => {
      ui.userInput.value = text;
      sendMessage();
    },
    onListeningChange: (listening) => avatar.setState(listening ? 'listening' : 'idle'),
    onSpeakingChange: (speaking) => avatar.setState(speaking ? 'speaking' : 'idle')
  });

  const reflectiveStarts = [
    'Interesting signal. Let us examine this together.',
    'I sense an assumption worth exploring.',
    'Before any answer, there is a better question.',
    'Your thought has potential depth.',
    'Let us slow down and reason with clarity.'
  ];
  const reflectivePrompts = [
    'What evidence currently supports your view?',
    'What would someone who disagrees say?',
    'Which belief here feels most fragile?',
    'If you could test one small experiment, what would it be?',
    'What outcome are you optimizing for?',
    'What part of this are you avoiding?',
    'How would your future self evaluate this reasoning?',
    'What assumption are you borrowing from others?',
    'If this fails, what would you learn?',
    'What question would reveal the truth fastest?'
  ];

  function init() {
    renderCategories();
    renderSuggestions();
    bindEvents();
    addMessage('ai', 'I am COGNI. I will not replace your thinking; I will expand it. What thought shall we investigate?');
  }

  function bindEvents() {
    ui.beginBtn.addEventListener('click', () => {
      ui.landing.classList.remove('active');
      setTimeout(() => {
        ui.landing.classList.add('hidden');
        ui.app.classList.remove('hidden');
        ui.userInput.focus();
      }, 500);
    });

    ui.sendBtn.addEventListener('click', sendMessage);
    ui.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
      else avatar.setState('typing');
    });
    ui.userInput.addEventListener('keyup', () => {
      if (!ui.userInput.value) avatar.setState('idle');
    });

    ui.voiceInputBtn.addEventListener('click', () => voice.startListening());
    ui.startListeningBtn.addEventListener('click', () => voice.startListening());
    ui.stopListeningBtn.addEventListener('click', () => voice.stopListening());
    ui.toggleVoiceBtn.addEventListener('click', () => {
      const isOn = voice.toggleVoice();
      ui.toggleVoiceBtn.textContent = isOn ? '🔊 Voice: ON' : '🔇 Voice: OFF';
    });

    ui.thinkModeBtn.addEventListener('click', () => {
      state.thinkMode = !state.thinkMode;
      state.thinkStep = 0;
      ui.thinkModeBtn.style.background = state.thinkMode ? 'rgba(105,240,197,.2)' : '';
      addMessage('ai', state.thinkMode
        ? `THINK MODE activated. ${state.thinkFlow[0]}`
        : 'THINK MODE paused. We can return to free inquiry.');
    });

    ui.askAnythingBtn.addEventListener('click', () => {
      state.askAnythingMode = !state.askAnythingMode;
      ui.askAnythingBtn.style.background = state.askAnythingMode ? 'rgba(109,213,255,.25)' : '';
      addMessage('ai', state.askAnythingMode
        ? 'Ask COGNI Anything mode engaged. I will still answer through questions and hints.'
        : 'Ask COGNI Anything mode disengaged. Category guidance restored.');
    });
  }

  function renderCategories() {
    ui.categoryTabs.innerHTML = '';
    window.COGNI_QUESTIONS.categories.forEach((category) => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = category;
      if (category === state.currentCategory) btn.style.background = 'rgba(109,213,255,.25)';
      btn.addEventListener('click', () => {
        state.currentCategory = category;
        renderCategories();
        renderSuggestions();
      });
      ui.categoryTabs.appendChild(btn);
    });
  }

  function renderSuggestions() {
    ui.suggestions.innerHTML = '';
    window.COGNI_QUESTIONS.promptsByCategory[state.currentCategory]
      .slice(0, 12)
      .forEach((prompt) => {
        const btn = document.createElement('button');
        btn.className = 'chip suggestion-btn';
        btn.textContent = prompt;
        btn.addEventListener('click', () => {
          ui.userInput.value = prompt;
          sendMessage();
        });
        ui.suggestions.appendChild(btn);
      });
  }

  function sendMessage() {
    const text = ui.userInput.value.trim();
    if (!text) return;
    addMessage('user', text);
    ui.userInput.value = '';
    avatar.setState('responding');
    ui.typingIndicator.classList.remove('hidden');

    setTimeout(() => {
      const response = generateResponse(text);
      ui.typingIndicator.classList.add('hidden');
      addMessage('ai', response);
      voice.speak(response);
      avatar.setState('idle');
      updateGamification();
    }, 650 + Math.random() * 650);
  }

  function generateResponse(userText) {
    if (state.thinkMode) {
      const prompt = state.thinkFlow[state.thinkStep] || 'What single principle are you taking from this reflection?';
      state.thinkStep += 1;
      return `THINK MODE • Step ${state.thinkStep}: ${prompt}`;
    }

    const starter = reflectiveStarts[Math.floor(Math.random() * reflectiveStarts.length)];
    const p1 = reflectivePrompts[Math.floor(Math.random() * reflectivePrompts.length)];
    const p2 = reflectivePrompts[Math.floor(Math.random() * reflectivePrompts.length)];

    if (/answer|solution|tell me exactly|just give/i.test(userText)) {
      return `${starter} I will not hand you a final answer. Try this: articulate your current best guess, then examine it through these questions: ${p1} Also: ${p2}`;
    }

    if (state.askAnythingMode) {
      return `${starter} Your prompt is valuable. Let us refine it: ${p1} Then continue with: ${p2}`;
    }

    return `${starter} To strengthen your thinking, begin with this: ${p1} After that, explore: ${p2}`;
  }

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = text;
    ui.chatHistory.appendChild(div);
    ui.chatHistory.scrollTop = ui.chatHistory.scrollHeight;
  }

  function updateGamification() {
    state.streak += 1;
    state.insight += 7;
    state.curiosity = Math.min(100, state.curiosity + 3);
    state.reflection = Math.min(100, state.reflection + 4);

    ui.streak.textContent = String(state.streak);
    ui.insightPoints.textContent = String(state.insight);
    ui.curiosityMeter.textContent = `${state.curiosity}%`;
    ui.reflectionBar.style.width = `${state.reflection}%`;
    ui.reflectionValue.textContent = `${state.reflection}%`;
  }

  init();
})();
