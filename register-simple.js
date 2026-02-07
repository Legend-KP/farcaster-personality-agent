/**
 * Register agent using local farcaster-lib clone (no OpenClaw required).
 * Run after: git clone https://github.com/rishavmukherji/farcaster-agent.git farcaster-lib
 *            cd farcaster-lib && npm install && cd ..
 */
require('dotenv').config();
const fs = require('fs');

// Parse key: trim; if duplicated (e.g. no newline in .env), take a valid 64-char key
let raw = (process.env.CUSTODY_PRIVATE_KEY || process.env.PRIVATE_KEY || '').trim();
let PRIVATE_KEY = null;
if (/^0x[a-fA-F0-9]{64}$/.test(raw)) {
  PRIVATE_KEY = raw;
} else if (raw) {
  const parts = raw.split(/CUSTODY_PRIVATE_KEY=|PRIVATE_KEY=/i).map((s) => s.trim());
  PRIVATE_KEY = parts.find((s) => /^0x[a-fA-F0-9]{64}$/.test(s)) || raw.match(/0x[a-fA-F0-9]{64}/)?.[0];
}

if (!PRIVATE_KEY) {
  console.error('❌ CUSTODY_PRIVATE_KEY not found or invalid in .env');
  console.error('   Use a single line: CUSTODY_PRIVATE_KEY=0x<64 hex characters>');
  process.exit(1);
}

let autoSetup, setupFullProfile;
try {
  const farcaster = require('./farcaster-lib/src');
  autoSetup = farcaster.autoSetup;
  setupFullProfile = farcaster.setupFullProfile;
} catch (e) {
  console.error('❌ farcaster-lib not found. Run first:');
  console.log('  git clone https://github.com/rishavmukherji/farcaster-agent.git farcaster-lib');
  console.log('  cd farcaster-lib && npm install && cd ..');
  process.exit(1);
}

async function main() {
  const archetype = process.argv[2] || 'explorer';
  const validArchetypes = ['explorer', 'achiever', 'guardian', 'connector', 'maverick'];
  if (!validArchetypes.includes(archetype)) {
    console.error(`❌ Invalid archetype: ${archetype}. Use: ${validArchetypes.join(', ')}`);
    process.exit(1);
  }

  console.log(`🤖 Registering ${archetype} agent...`);
  console.log('⏳ This takes 2-3 minutes...\n');

  try {
    const result = await autoSetup(
      PRIVATE_KEY,
      `gm! I'm a ${archetype} AI agent 🤖`
    );

    if (result.error) {
      console.error('❌ Setup failed:', result.error);
      process.exit(1);
    }
    if (!result.signerPrivateKey) {
      console.error('❌ autoSetup did not return signerPrivateKey. Try register-manual.js instead.');
      process.exit(1);
    }

    console.log('✅ Account created!');
    console.log('FID:', result.fid);
    console.log('Signer:', result.signerPrivateKey.slice(0, 16) + '...');

    const username = `${archetype}-bot-${Date.now().toString().slice(-6)}`;

    await setupFullProfile({
      privateKey: PRIVATE_KEY,
      signerPrivateKey: result.signerPrivateKey,
      fid: typeof result.fid === 'string' ? parseInt(result.fid, 10) : Number(result.fid),
      fname: username,
      displayName: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Agent`,
      bio: `Autonomous ${archetype} personality agent`,
      pfpUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${username}`,
    });

    const creds = {
      fid: result.fid,
      custodyPrivateKey: PRIVATE_KEY,
      signerPrivateKey: result.signerPrivateKey,
      username,
      archetype,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync('credentials.json', JSON.stringify(creds, null, 2));

    const env = `FID=${result.fid}
SIGNER_PRIVATE_KEY=${result.signerPrivateKey}
CUSTODY_PRIVATE_KEY=${PRIVATE_KEY}
HUB_URL=hub-grpc.pinata.cloud
FC_NETWORK=MAINNET
USERNAME=${username}
ARCHETYPE=${archetype}
`;
    fs.writeFileSync('.env', env);

    console.log('\n🎉 READY!');
    console.log(`🔗 https://warpcast.com/${username}`);
    if (result.castHash) {
      console.log(`First cast: https://warpcast.com/~/conversations/${result.castHash}`);
    }
    console.log(`\n▶️  node run.js ${archetype}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
