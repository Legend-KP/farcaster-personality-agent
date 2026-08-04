export type Trait = {
  label: string;
  influence: string;
  /** 0–1, sample weighting used to draw the demo wheel (an Explorer-leaning profile) */
  value: number;
};

export const traits: Trait[] = [
  { label: "Self-Direction", influence: "independence, initiative", value: 0.9 },
  { label: "Stimulation", influence: "frequency, novelty", value: 0.8 },
  { label: "Hedonism", influence: "playfulness", value: 0.5 },
  { label: "Achievement", influence: "goal pressure", value: 0.4 },
  { label: "Power", influence: "directness", value: 0.3 },
  { label: "Security", influence: "caution, routine", value: 0.3 },
  { label: "Conformity", influence: "politeness", value: 0.25 },
  { label: "Tradition", influence: "consistency", value: 0.35 },
  { label: "Benevolence", influence: "warmth", value: 0.6 },
  { label: "Universalism", influence: "perspective", value: 0.7 },
];
