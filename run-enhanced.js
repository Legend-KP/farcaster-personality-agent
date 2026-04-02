require('dotenv').config();
const EnhancedFarcasterAgent = require('./src/agent-enhanced');

async function main() {
  const archetype = process.argv[2];

  if (!archetype) {
    console.error('\n❌ Please specify an archetype!');
    console.log('\nUsage: node run-enhanced.js <archetype>');
    console.log('\nAvailable archetypes:');
    console.log('  • explorer   - Curious, independent, seeks novelty');
    console.log('  • achiever   - Goal-oriented, competitive, professional');
    console.log('  • guardian   - Stable, traditional, community-focused');
    console.log('  • connector  - Helpful, supportive, relationship-focused');
    console.log('  • maverick   - Unconventional, independent, risk-taking\n');
    process.exit(1);
  }

  // Check for required credentials
  console.log('\n🔍 Checking configuration...\n');

  if (!process.env.CUSTODY_PRIVATE_KEY) {
    console.error('❌ CUSTODY_PRIVATE_KEY not found in .env');
    process.exit(1);
  }

  if (!process.env.SIGNER_PRIVATE_KEY) {
    console.error('❌ SIGNER_PRIVATE_KEY not found in .env');
    process.exit(1);
  }

  // Optional features
  const hasOpenClawAI = process.env.USE_OPENCLAW_AI === '1';
  const hasNeynarAPI = !!process.env.NEYNAR_API_KEY;
  const engageEnabled = process.env.ENGAGE_ENABLED === '1';

  console.log('Configuration:');
  console.log(`  Claude AI (OpenClaw): ${hasOpenClawAI ? '✅ Enabled' : '⚠️  Disabled (set USE_OPENCLAW_AI=1)'}`);
  console.log(`  Feed Reading: ${hasNeynarAPI ? '✅ Enabled' : '⚠️  Disabled (add NEYNAR_API_KEY)'}`);
  console.log(`  Engagement: ${engageEnabled ? '✅ Enabled' : '⚠️  Disabled (set ENGAGE_ENABLED=1)'}`);
  console.log('');

  if (!hasOpenClawAI) {
    console.log('💡 To enable AI-generated content (FREE):');
    console.log('   1. Install OpenClaw: npm install -g openclaw');
    console.log('   2. Add to .env: USE_OPENCLAW_AI=1\n');
  }

  if (!hasNeynarAPI) {
    console.log('💡 To enable feed reading and engagement:');
    console.log('   1. Get API key from https://neynar.com/');
    console.log('   2. Add to .env: NEYNAR_API_KEY=...\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const agent = new EnhancedFarcasterAgent(archetype);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⚠️  Received SIGINT (Ctrl+C)');
    agent.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n⚠️  Received SIGTERM');
    agent.stop();
    process.exit(0);
  });

  try {
    await agent.initialize();
    await agent.run();
  } catch (error) {
    console.error('\n💥 Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
