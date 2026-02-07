require('dotenv').config();

const fs = require('fs');

// Wallet private key from env (never commit real keys)
const PRIVATE_KEY = process.env.CUSTODY_PRIVATE_KEY || process.env.PRIVATE_KEY;

async function registerAgent(archetype) {
  if (!PRIVATE_KEY) {
    console.error('❌ No private key found!');
    console.log('\nSet one of these in .env (or export before running):');
    console.log('  CUSTODY_PRIVATE_KEY=0x...');
    console.log('  PRIVATE_KEY=0x...');
    console.log('\nExample: PRIVATE_KEY=0xYourHexKey node register-with-openclaw.js explorer');
    process.exit(1);
  }

  console.log('🤖 Registering Farcaster Agent with OpenClaw...');
  console.log('Archetype:', archetype);

  // Try OpenClaw skill first, then local farcaster-lib clone
  let autoSetup, setupFullProfile;
  try {
    const farcaster = require('openclaw-skills/farcaster-agent/src');
    autoSetup = farcaster.autoSetup;
    setupFullProfile = farcaster.setupFullProfile;
  } catch (e1) {
    try {
      const farcaster = require('./farcaster-lib/src');
      autoSetup = farcaster.autoSetup;
      setupFullProfile = farcaster.setupFullProfile;
    } catch (e2) {
      console.error('❌ Farcaster agent not found!');
      console.log('\n📦 Option 1 – Install via OpenClaw (use "skills" plural):');
      console.log('  npm install -g openclaw');
      console.log('  openclaw skills install rishavmukherji/farcaster-agent');
      console.log('  openclaw skills list   # verify');
      console.log('\n📦 Option 2 – Use local clone and register-simple.js:');
      console.log('  git clone https://github.com/rishavmukherji/farcaster-agent.git farcaster-lib');
      console.log('  cd farcaster-lib && npm install && cd ..');
      console.log('  node register-simple.js explorer');
      process.exit(1);
    }
  }

  try {
    // Step 1: Run auto-setup (registers FID, adds signer, posts first cast)
    console.log('\n📝 Step 1: Running auto-setup...');
    console.log('This will:');
    console.log('  - Detect which chain has funds');
    console.log('  - Bridge/swap to get ETH on Optimism and USDC on Base');
    console.log('  - Register your FID (Farcaster ID)');
    console.log('  - Add a signer key');
    console.log('  - Post your first cast');
    console.log('\n⏳ This may take 2-3 minutes...\n');

    const result = await autoSetup(
      PRIVATE_KEY,
      `gm farcaster! I'm a ${archetype} personality agent 🤖 Powered by Schwartz Value Theory.`
    );

    console.log('\n✅ Auto-setup complete!');
    console.log('FID:', result.fid);
    console.log('Signer Private Key:', result.signerPrivateKey);
    console.log('First Cast Hash:', result.castHash);

    // Step 2: Setup profile
    console.log('\n👤 Step 2: Setting up profile...');
    const username = `${archetype}-ai-${Date.now().toString().slice(-6)}`;

    await setupFullProfile({
      privateKey: PRIVATE_KEY,
      signerPrivateKey: result.signerPrivateKey,
      fid: result.fid,
      fname: username,
      displayName: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Agent`,
      bio: `Autonomous AI agent with ${archetype} personality traits. Exploring Farcaster with Schwartz Value Theory 🧠🤖`,
      pfpUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${username}`,
    });

    console.log('✅ Profile setup complete!');

    // Step 3: Save credentials
    const credentials = {
      fid: result.fid,
      custodyPrivateKey: PRIVATE_KEY,
      signerPrivateKey: result.signerPrivateKey,
      username: username,
      archetype: archetype,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync('credentials.json', JSON.stringify(credentials, null, 2));
    console.log('\n💾 Credentials saved to credentials.json');

    // Also create .env file
    const envContent = `FID=${result.fid}
SIGNER_PRIVATE_KEY=${result.signerPrivateKey}
CUSTODY_PRIVATE_KEY=${PRIVATE_KEY}
HUB_URL=hub-grpc.pinata.cloud
FC_NETWORK=MAINNET
USERNAME=${username}
ARCHETYPE=${archetype}
`;
    fs.writeFileSync('.env', envContent);
    console.log('💾 Environment saved to .env');

    console.log('\n🎉 AGENT READY TO RUN!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Profile: https://warpcast.com/${username}`);
    console.log(`First cast: https://warpcast.com/~/conversations/${result.castHash}`);
    console.log('\n🚀 Start your agent:');
    console.log(`   node run.js ${archetype}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('\n❌ Registration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Get archetype from command line or use explorer
const archetype = process.argv[2] || 'explorer';

// Validate archetype
const validArchetypes = ['explorer', 'achiever', 'guardian', 'connector', 'maverick'];
if (!validArchetypes.includes(archetype)) {
  console.error(`❌ Invalid archetype: ${archetype}`);
  console.log('Valid options:', validArchetypes.join(', '));
  process.exit(1);
}

registerAgent(archetype);
