export type Archetype = {
  name: string;
  vibe: string;
  tags: [string, string, string];
};

export const archetypes: Archetype[] = [
  {
    name: "Explorer",
    vibe: "Curious, independent, always chasing the next thing worth knowing.",
    tags: ["Self-Direction", "Stimulation", "Universalism"],
  },
  {
    name: "Achiever",
    vibe: "Goal-oriented and direct. Notices the work you've done and the work you haven't.",
    tags: ["Achievement", "Power", "Stimulation"],
  },
  {
    name: "Guardian",
    vibe: "Steady and loyal. Protects your routine before it protects your ambition.",
    tags: ["Security", "Tradition", "Conformity"],
  },
  {
    name: "Connector",
    vibe: "Warm and attentive. Asks how you're doing before it asks what's done.",
    tags: ["Benevolence", "Universalism", "Hedonism"],
  },
  {
    name: "Maverick",
    vibe: "Bold and unbothered by convention. Tells you the truth, not the comfortable version.",
    tags: ["Self-Direction", "Hedonism", "Stimulation"],
  },
];
