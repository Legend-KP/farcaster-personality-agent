/** Public inbox for project notes. Swap this before the site goes live. */
export const STUDIO_EMAIL = "hello@emris.games";

export const EXPERTISE = [
  {
    title: "Game design",
    body: "Loops, difficulty, and economy. The reason a session feels fair and worth another run.",
  },
  {
    title: "Gameplay engineering",
    body: "Feel, cameras, combat, and the frame the player trusts when the action gets fast.",
  },
  {
    title: "Art direction",
    body: "Worlds with one point of view. Color, shape, and lighting that belong to the game.",
  },
  {
    title: "Multiplayer",
    body: "Sessions, match flow, and the social layer around a match that has to hold a crowd.",
  },
  {
    title: "Narrative",
    body: "Story that serves play. Characters and stakes that show up in the systems, not only in a cutscene.",
  },
  {
    title: "Live games",
    body: "Seasons, balance, and updates that respect the people who already made the game a habit.",
  },
  {
    title: "Tools and pipelines",
    body: "Editors and builds that let a team change the game every day without breaking it.",
  },
  {
    title: "Performance and ports",
    body: "The same game, steady, on the machines people actually own.",
  },
] as const;

export const STUDIO_FACTS = [
  { label: "Experience", value: "10+ years" },
  { label: "Focus", value: "Original games" },
  { label: "Platforms", value: "PC, console, mobile, web" },
  { label: "Craft", value: "Design, code, art" },
  { label: "Delivery", value: "Prototype to live" },
  { label: "Partners", value: "Studios and publishers" },
] as const;

export const CAPABILITIES = [
  {
    title: "New games",
    body: "Original work taken from a pitch, or a blank page, through a shippable build.",
  },
  {
    title: "Prototypes",
    body: "A playable that answers the only question that matters: is this fun.",
  },
  {
    title: "Production",
    body: "Levels, systems, art, and audio brought up together, not in a pile at the end.",
  },
  {
    title: "Live seasons",
    body: "Content, balance, and operations after launch, when the real players arrive.",
  },
  {
    title: "Co-development",
    body: "A senior pod that joins a team already in production and takes a slice of the game.",
  },
  {
    title: "Technical passes",
    body: "Feel, frame time, and platform work when a game is close and has to hold up.",
  },
] as const;

export const PRACTICE = [
  { value: "10+", label: "Years building games" },
  { value: "End to end", label: "First playable through live" },
  { value: "One studio", label: "Design, engineering, and art" },
  { value: "Players first", label: "We ship what we would play" },
] as const;

export const PROCESS = [
  {
    title: "Discover",
    body: "The fantasy, the player, and the loop. We write down what the game is for before we build the wrong one.",
    note: "Weeks, not a binder",
  },
  {
    title: "Prototype",
    body: "A small build that proves the feel. If it is not fun here, it will not become fun later.",
    note: "Playable early",
  },
  {
    title: "Produce",
    body: "Content, systems, and art on one schedule. The game stays playable while it grows.",
    note: "A build every week",
  },
  {
    title: "Launch",
    body: "Platforms, performance, store presence, and the first session a stranger will actually finish.",
    note: "The first hour matters",
  },
  {
    title: "Sustain",
    body: "Patches, seasons, and the reasons people come back. A game is not done when it ships.",
    note: "After the launch week",
  },
] as const;

export const FAQ = [
  {
    q: "What does Emris make?",
    a: "Games. Original titles, prototypes, co-development, and live updates. We are a studio, not an agency that wraps a slideshow around someone else's engine demo.",
  },
  {
    q: "How long have you been building games?",
    a: "More than ten years. That time is in design, engineering, art direction, and shipping — including the unglamorous work of keeping a live game healthy.",
  },
  {
    q: "Which platforms do you ship on?",
    a: "PC, console, mobile, and the browser. The platform follows the game. We would rather do one of them properly than list all of them and hope.",
  },
  {
    q: "Do you take outside projects?",
    a: "Yes. Publishers, other studios, and founders with a real game in mind. We are selective about scope. If we cannot do the work well, we say so.",
  },
  {
    q: "What do you need to start?",
    a: "A description of the game, who it is for, and where it is in its life: an idea, a prototype, or a production that needs more hands. A pitch deck is optional. A clear sentence is not.",
  },
  {
    q: "How do timelines work?",
    a: "A prototype is weeks. A full production is the length the game actually needs, agreed before anyone pretends otherwise. We would rather name a real date than a hopeful one.",
  },
] as const;
