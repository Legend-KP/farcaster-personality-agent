require('dotenv').config();

const FarcasterAgent = require('./src/agent');

const archetypeName = process.argv[2] || 'explorer';
const agent = new FarcasterAgent(archetypeName);

function main() {
  return agent.initialize().then(() => agent.run());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  agent.stop();
  process.exit(0);
});
process.on('SIGTERM', () => {
  agent.stop();
  process.exit(0);
});
