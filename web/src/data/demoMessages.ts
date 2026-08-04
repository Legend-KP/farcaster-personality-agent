export type DemoMessage = {
  archetype: string;
  message: string;
};

/** All five responses share the same context: the night before a big presentation. */
export const demoMessages: DemoMessage[] = [
  {
    archetype: "Guardian",
    message:
      "Hey — tomorrow's the big one. Sleep ok? Want me to hold your morning free so you're not rushed?",
  },
  {
    archetype: "Achiever",
    message:
      "Tomorrow's the presentation. Deck's final, you've reviewed it twice. You've done the work — go execute.",
  },
  {
    archetype: "Maverick",
    message: "Big day tomorrow. You're ready, you're just scared. Go to bed.",
  },
  {
    archetype: "Connector",
    message:
      "Thinking of you before tomorrow. You've got people in your corner — let me know how it goes?",
  },
  {
    archetype: "Explorer",
    message:
      "Tomorrow's the day. Nervous is just excitement without a plan — what's one thing you're curious to see happen?",
  },
];
