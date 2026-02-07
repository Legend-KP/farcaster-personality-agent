/**
 * Complete profile setup when register-manual.js succeeded but fname registration failed.
 * Registers a valid fname (max 16 chars, lowercase alphanumeric + hyphens) and saves credentials.
 */
require('dotenv').config();
const fs = require('fs');
const { registerFname } = require('./farcaster-lib/src');

// Same key parsing as other scripts
let raw = (process.env.CUSTODY_PRIVATE_KEY || process.env.PRIVATE_KEY || '').trim();
let PRIVATE_KEY = null;
if (/^0x[a-fA-F0-9]{64}$/.test(raw)) {
  PRIVATE_KEY = raw;
} else if (raw) {
  const parts = raw.split(/CUSTODY_PRIVATE_KEY=|PRIVATE_KEY=/i).map((s) => s.trim());
  PRIVATE_KEY = parts.find((s) => /^0x[a-fA-F0-9]{64}$/.test(s)) || raw.match(/0x[a-fA-F0-9]{64}/)?.[0];
}

function generateValidFname(archetype) {
  const suffix = Math.floor(1000 + Math.random() * 9000).toString();
  const name = `${archetype}-${suffix}`;
  return name.slice(0, 16);
}

async function completeSetup() {
  console.log('🔧 Completing profile setup...\n');

  if (!PRIVATE_KEY) {
    console.error('❌ CUSTODY_PRIVATE_KEY not found in .env');
    process.exit(1);
  }

  // Load from credentials.json (from register-manual partial save) or use env / defaults
  let fid = process.env.FID ? parseInt(process.env.FID, 10) : null;
  let signerPrivateKey = process.env.SIGNER_PRIVATE_KEY || null;
  let archetype = process.env.ARCHETYPE || 'explorer';

  if (fs.existsSync('credentials.json')) {
    try {
      const creds = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
      if (creds.fid) fid = parseInt(creds.fid, 10);
      if (creds.signerPrivateKey) signerPrivateKey = creds.signerPrivateKey;
      if (creds.archetype) archetype = creds.archetype;
    } catch (e) {
      console.warn('Could not load credentials.json:', e.message);
    }
  }

  if (!fid || !signerPrivateKey) {
    console.error('❌ Need FID and SIGNER_PRIVATE_KEY. Set in .env or ensure credentials.json has them.');
    process.exit(1);
  }

  const username = generateValidFname(archetype);
  console.log('📝 Attempting username:', username);
  console.log('   Length:', username.length, '(max 16)');
  console.log('   Valid:', /^[a-z0-9][a-z0-9-]{0,15}$/.test(username));

  try {
    console.log('\n🎯 Registering username...');
    await registerFname({
      privateKey: PRIVATE_KEY,
      signerPrivateKey,
      fid,
      fname: username
    });

    console.log('✅ Username registered!');

    const credentials = {
      fid: fid.toString(),
      custodyPrivateKey: PRIVATE_KEY,
      signerPrivateKey,
      username,
      archetype,
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync('credentials.json', JSON.stringify(credentials, null, 2));

    const envBlock = `
FID=${fid}
SIGNER_PRIVATE_KEY=${signerPrivateKey}
USERNAME=${username}
ARCHETYPE=${archetype}
HUB_URL=hub-grpc.pinata.cloud
FC_NETWORK=MAINNET
`;
    const envPath = '.env';
    const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    if (!envContent.includes('USERNAME=') || !envContent.includes(`FID=${fid}`)) {
      fs.appendFileSync(envPath, envBlock);
    }

    console.log('\n💾 Credentials saved!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Profile: https://warpcast.com/${username}`);
    console.log('\n🚀 Your agent is ready:');
    console.log(`   node run.js ${archetype}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (fs.existsSync('setup-progress.json')) {
      fs.unlinkSync('setup-progress.json');
    }
  } catch (error) {
    if (error.message.includes('already') || error.message.includes('taken') || error.message.includes('claimed')) {
      console.log('\n💡 Username taken, trying another...');
      const newUsername = generateValidFname(archetype);
      try {
        await registerFname({
          privateKey: PRIVATE_KEY,
          signerPrivateKey,
          fid,
          fname: newUsername
        });
        console.log('✅ Username registered:', newUsername);
        const credentials = {
          fid: fid.toString(),
          custodyPrivateKey: PRIVATE_KEY,
          signerPrivateKey,
          username: newUsername,
          archetype,
          createdAt: new Date().toISOString()
        };
        fs.writeFileSync('credentials.json', JSON.stringify(credentials, null, 2));
        console.log(`\n✅ Profile: https://warpcast.com/${newUsername}`);
        console.log(`\n🚀 Run: node run.js ${archetype}`);
        return;
      } catch (retryError) {
        console.error('Retry failed:', retryError.message);
      }
    }
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

completeSetup();
