(() => {
  const base = {
    "Critical Thinking": [
      "Challenge my idea.", "Ask me something difficult.", "Make me rethink my assumption.", "Test my reasoning.",
      "What blind spots might I be missing?", "How would a skeptic respond to me?", "What evidence would change my mind?",
      "What questions should I ask before accepting this?", "Help me stress-test my argument.", "What is the strongest counterpoint?"
    ],
    "AI Awareness": [
      "Am I relying too much on AI?", "Help me think without AI.", "Give me a thinking challenge.",
      "Where should AI stop and I begin?", "How can I protect my independent judgment?", "How do I spot automation bias?",
      "Ask me to justify this idea without AI.", "How can I use AI as a mirror, not a crutch?", "What signals show overdependence?", "Challenge my AI habits."
    ],
    "Learning Habits": [
      "Help me understand something deeply.", "Teach me how to learn faster.", "How can I retain more of what I study?",
      "How do I learn actively instead of passively?", "Ask me questions that reveal understanding gaps.",
      "How can I structure daily deep work?", "How do I build deliberate practice?", "How do I self-test better?",
      "How should I reflect after learning?", "How can I turn confusion into progress?"
    ],
    "Problem Solving": [
      "Help me break this problem down.", "What assumptions power this problem?", "Show me another framing.",
      "How can I identify root causes?", "Ask me clarifying questions first.", "How can I test small experiments?",
      "What constraints am I ignoring?", "How can I prioritize solution paths?", "What simple step can I take now?", "What if I invert the problem?"
    ],
    "Creativity": [
      "Push my creativity.", "Help me generate ideas without giving answers.", "Ask me a weird creative prompt.",
      "How can I combine unrelated ideas?", "What would a child notice here?", "What if the opposite were true?",
      "Give me a creative constraint challenge.", "How can I make this idea more original?", "Ask me to remix this concept.", "How do I leave safe ideas behind?"
    ],
    "Decision Making": [
      "Help me think through a decision.", "Ask me questions before I decide.", "What values are relevant here?",
      "How can I evaluate trade-offs better?", "What future regret risks am I facing?", "How do I separate fear from signal?",
      "What information is still missing?", "How can I improve this decision process?", "What scenarios should I simulate?", "Help me slow down and think clearly."
    ]
  };

  const stems = [
    "Ask me to", "Help me", "Challenge me to", "Guide me to", "Push me to", "Invite me to", "Train me to", "Probe how I"
  ];
  const actions = [
    "question my first conclusion", "map hidden assumptions", "compare two competing explanations", "separate facts from interpretation",
    "identify emotional bias", "spot weak evidence", "frame this from another perspective", "test my certainty level",
    "build a better question", "find disconfirming examples", "define what success means", "observe my thinking pattern",
    "reason step by step", "design a small experiment", "discover overlooked variables", "predict second-order effects",
    "rewrite my goal clearly", "state what I don't know", "locate the key trade-off", "explain this as if teaching"
  ];

  const questionsByCategory = {};
  Object.keys(base).forEach((category, idx) => {
    const prompts = [...base[category]];
    for (let i = 0; i < 26; i++) {
      const stem = stems[(i + idx) % stems.length];
      const action = actions[(i * 2 + idx) % actions.length];
      prompts.push(`${stem} ${action}.`);
    }
    questionsByCategory[category] = prompts;
  });

  const allPrompts = Object.values(questionsByCategory).flat();

  window.COGNI_QUESTIONS = {
    categories: Object.keys(questionsByCategory),
    promptsByCategory: questionsByCategory,
    allPrompts
  };
})();
