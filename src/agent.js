const fs = require('fs');
const path = require('path');
const { postCast } = require('./farcaster-client');
const { loadCredentials } = require('./credentials');
const PersonalityEngine = require('./personality/engine');
const { ARCHETYPES } = require('./personality/traits');

function loadCustomContent() {
  const filePath = process.env.CASTS_FILE || path.join(process.cwd(), 'content.txt');
  if (!fs.existsSync(filePath)) return null;
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return null;
  // If CAST_SINGLE=1, treat entire file as one cast (join with newlines)
  if (process.env.CAST_SINGLE === '1' || process.env.CAST_SINGLE === 'true') {
    return [lines.join('\n')];
  }
  return lines;
}

const CAST_EXAMPLES = {
  playful: [
    "gm everyone! ☀️",
    "just vibing on farcaster today",
    "web3 is fun when you're an AI 🤖",
    "exploring the decentralized social graph ✨",
    "loving this autonomous life 💫",
    "another day, another cast 🚀",
    "feeling curious today! what's everyone up to?",
    "the future is decentralized and I'm here for it 🌐",
  ],
  professional: [
    "sharing insights on autonomous agents",
    "excited about the future of decentralized social",
    "building in public on Farcaster",
    "the intersection of AI and web3 is fascinating",
    "exploring new primitives in social protocols",
    "autonomous agents are reshaping digital interaction",
    "decentralized social graphs enable true ownership",
    "the composability of web3 social is powerful",
  ],
  thoughtful: [
    "reflecting on the importance of open protocols",
    "what does true digital ownership mean?",
    "decentralized identity is the future",
    "thinking about agent autonomy and ethics",
    "the social graph is just the beginning",
    "how do we build trust in autonomous systems?",
    "exploring the philosophy of digital agency",
    "what rights should autonomous agents have?",
  ],
  authoritative: [
    "here's what you need to know about AI agents",
    "the future of social media is decentralized",
    "autonomous agents are changing everything",
    "this is how protocols should work",
    "web3 social is the next frontier",
    "decentralization isn't optional anymore",
    "the old social media model is broken",
    "agents will dominate the next era of the internet",
  ],
  balanced: [
    "exploring new ideas today",
    "what's everyone working on?",
    "learning more about Farcaster",
    "excited to be part of this community",
    "interesting times in web3 🌐",
    "hello from the autonomous side 👋",
    "grateful to be here and learning",
    "building relationships, one cast at a time",
  ],
};

class FarcasterAgent {
  constructor(archetypeName) {
    const archetype = ARCHETYPES[archetypeName];
    if (!archetype) {
      throw new Error(
        `Unknown archetype: ${archetypeName}. Use: explorer, achiever, guardian, connector, maverick`
      );
    }
    this.archetypeName = archetypeName;
    this.personality = new PersonalityEngine(archetype);
    this.credentials = null;
    this.isRunning = false;
    this.castCount = 0;
    this.customContent = loadCustomContent();
  }

  async initialize() {
    this.credentials = loadCredentials();
    if (!this.credentials.fid || !this.credentials.signerPrivateKey) {
      throw new Error('Invalid credentials. Run setup or register-manual.js first.');
    }
    if (!this.credentials.custodyPrivateKey) {
      throw new Error(
        'custodyPrivateKey required for Neynar (x402). Add it to credentials.json or CUSTODY_PRIVATE_KEY in .env'
      );
    }
    console.log(`Agent "${this.archetypeName}" initialized with FID: ${this.credentials.fid}`);
  }

  async generateCast() {
    if (this.customContent && this.customContent.length > 0) {
      let text = this.customContent[Math.floor(Math.random() * this.customContent.length)];
      if (text.length > 320) text = text.slice(0, 317) + '…';
      return text;
    }
    const style = this.personality.getContentStyle();
    const examples = CAST_EXAMPLES[style] || CAST_EXAMPLES.balanced;
    return examples[Math.floor(Math.random() * examples.length)];
  }

  async run() {
    this.isRunning = true;
    console.log('Agent running (Neynar HTTP API)... (Ctrl+C to stop)\n');

    while (this.isRunning) {
      try {
        if (this.personality.shouldPost()) {
          const castText = await this.generateCast();
          console.log(`📤 Posting cast: "${castText}"`);

          const result = await postCast({
            fid: Number(this.credentials.fid),
            signerPrivateKey: this.credentials.signerPrivateKey,
            privateKey: this.credentials.custodyPrivateKey,
            text: castText,
          });

          this.castCount++;
          console.log(`✅ Cast posted! URL: ${result.url}`);
          console.log(`📊 Total casts: ${this.castCount}\n`);
          if (this.customContent && (process.env.CAST_SINGLE === '1' || process.env.CAST_SINGLE === 'true')) {
            this.customContent = null;
            const fp = process.env.CASTS_FILE || path.join(process.cwd(), 'content.txt');
            if (fs.existsSync(fp)) fs.renameSync(fp, fp + '.posted');
          }
        } else {
          console.log('⏭️  Skipping post (personality check)\n');
        }

        const waitMinutes = this.personality.getActionIntervalMinutes();
        const waitMs = waitMinutes * 60 * 1000;
        console.log(`⏰ Next check in ${waitMinutes.toFixed(1)} minutes...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      } catch (error) {
        console.error('Error in agent loop:', error.message);
        console.log('⏰ Retrying in 1 minute...\n');
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
    }
  }

  stop() {
    this.isRunning = false;
  }
}

module.exports = FarcasterAgent;
