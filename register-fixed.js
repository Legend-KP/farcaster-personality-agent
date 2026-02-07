/**
 * Register agent with nonce handling so retries work after a previous run used nonce 0.
 * Use this if register-simple.js fails with "nonce too low" or "next nonce should be 1".
 */
require('dotenv').config();
const fs = require('fs');
const { JsonRpcProvider, Wallet } = require('ethers');

// Same key parsing as register-simple (handles .env line concat)
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

const { autoSetup, setupFullProfile } = require('./farcaster-lib/src');

async function checkNonce() {
  const baseProvider = new JsonRpcProvider('https://mainnet.base.org');
  const opProvider = new JsonRpcProvider('https://mainnet.optimism.io');
  const wallet = new Wallet(PRIVATE_KEY, baseProvider);

  const baseNonce = await baseProvider.getTransactionCount(wallet.address, 'latest');
  const opNonce = await opProvider.getTransactionCount(wallet.address, 'latest');
  console.log('  Base nonce (latest):', baseNonce);
  console.log('  Optimism nonce (latest):', opNonce);
  return { baseNonce, opNonce };
}

async function main() {
  const archetype = process.argv[2] || 'explorer';
  const validArchetypes = ['explorer', 'achiever', 'guardian', 'connector', 'maverick'];
  if (!validArchetypes.includes(archetype)) {
    console.error(`❌ Invalid archetype: ${archetype}. Use: ${validArchetypes.join(', ')}`);
    process.exit(1);
  }

  console.log(`🤖 Registering ${archetype} agent...`);
  console.log('🔍 Checking wallet nonce (Base & Optimism)...');
  await checkNonce();
  console.log('⏳ This takes 2-3 minutes...\n');

  try {
    const result = await autoSetup(
      PRIVATE_KEY,
      `gm! I'm a ${archetype} AI agent 🤖`
    );

    if (result.error) {
      console.error('❌', result.error);
      process.exit(1);
    }

    console.log('✅ Account created!');
    console.log('FID:', result.fid);
    console.log('Signer:', result.signerPrivateKey);

    const username = `${archetype}-bot-${Date.now().toString().slice(-6)}`;

    await setupFullProfile({
      privateKey: PRIVATE_KEY,
      signerPrivateKey: result.signerPrivateKey,
      fid: result.fid,
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

    const envBlock = `
# Farcaster agent credentials (added by register-fixed.js)
FID=${result.fid}
SIGNER_PRIVATE_KEY=${result.signerPrivateKey}
USERNAME=${username}
HUB_URL=hub-grpc.pinata.cloud
FC_NETWORK=MAINNET
ARCHETYPE=${archetype}
`;
    fs.appendFileSync('.env', envBlock);
    console.log('\n💾 Credentials saved to credentials.json and appended to .env');

    console.log('\n🎉 READY!');
    console.log(`🔗 https://warpcast.com/${username}`);
    if (result.castHash) {
      console.log(`First cast: https://warpcast.com/~/conversations/${result.castHash}`);
    }
    console.log(`\n▶️  node run.js ${archetype}`);
  } catch (err) {
    console.error('❌ Error:', err.message);

    if (err.message && (err.message.includes('nonce') || err.code === 'NONCE_EXPIRED' || err.code === 'REPLACEMENT_UNDERPRICED')) {
      console.log('\n💡 Nonce error. Try:');
      console.log('1. Wait 1–2 minutes and run again: node register-fixed.js ' + archetype);
      console.log('2. Check wallet on Base: https://basescan.org/address/' + new Wallet(PRIVATE_KEY).address);
      console.log('3. If you see pending transactions, wait for them to confirm');
    }

    process.exit(1);
  }
}

main();
