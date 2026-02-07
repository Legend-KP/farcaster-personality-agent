/**
 * Manual registration – bypasses auto-setup to avoid BigInt/conversion bugs in farcaster-lib.
 * Runs each step: check funds → register FID → add signer → post cast → setup profile.
 */
require('dotenv').config();
const { Wallet, JsonRpcProvider, Contract, parseUnits, formatUnits } = require('ethers');
const fs = require('fs');

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
  console.error('❌ CUSTODY_PRIVATE_KEY not found in .env');
  console.error('   Use a single line: CUSTODY_PRIVATE_KEY=0x<64 hex characters>');
  process.exit(1);
}

// Import individual functions instead of auto-setup
const { registerFid, addSigner, postCast, setupFullProfile } = require('./farcaster-lib/src');

async function manualSetup(archetype) {
  console.log(`🤖 Registering ${archetype} agent manually...`);
  console.log('⏳ This process will take 3-5 minutes...\n');

  const wallet = new Wallet(PRIVATE_KEY);
  console.log('Wallet:', wallet.address);

  try {
    // Step 1: Check if we have enough funds
    console.log('\n📊 Step 1: Checking funds...');
    const baseProvider = new JsonRpcProvider('https://mainnet.base.org');

    const ethBalance = await baseProvider.getBalance(wallet.address);
    console.log(`Base ETH: ${formatUnits(ethBalance, 18)}`);

    const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
    const usdcAbi = ['function balanceOf(address) view returns (uint256)'];
    const usdcContract = new Contract(USDC_BASE, usdcAbi, baseProvider);
    const usdcBalance = await usdcContract.balanceOf(wallet.address);
    console.log(`Base USDC: ${formatUnits(usdcBalance, 6)}`);

    console.log('\n📊 Checking Optimism balance...');
    const opProvider = new JsonRpcProvider('https://mainnet.optimism.io');
    const opBalance = await opProvider.getBalance(wallet.address);
    console.log(`Optimism ETH: ${formatUnits(opBalance, 18)}`);

    if (opBalance < parseUnits('0.0001', 18)) {
      console.log('\n⚠️  Not enough ETH on Optimism for registration.');
      console.log('You need to bridge some ETH to Optimism manually.');
      console.log('\nOptions:');
      console.log('1. Use https://app.optimism.io/bridge');
      console.log('2. Use https://relay.link/bridge/base-optimism');
      console.log('3. Send ETH directly to Optimism network');
      console.log(`\nYour address: ${wallet.address}`);
      console.log('\nAfter bridging, run this script again.');

      fs.writeFileSync('setup-progress.json', JSON.stringify({
        step: 'need_optimism_eth',
        wallet: wallet.address,
        archetype
      }, null, 2));

      process.exit(0);
    }

    // Step 2: Register FID
    console.log('\n📝 Step 2: Registering FID on Optimism...');
    console.log('This costs ~$0.20 and takes 30-60 seconds...');

    const fidResult = await registerFid(PRIVATE_KEY);
    const fidNum = Number(fidResult.fid);
    const fidStr = fidResult.fid.toString();
    console.log('✅ FID registered:', fidStr);

    // Wait for hub sync
    console.log('\n⏳ Waiting for hub to sync (30 seconds)...');
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Step 3: Add signer key (addSigner only takes privateKey; it gets FID from chain)
    console.log('\n🔑 Step 3: Adding signer key...');
    console.log('This costs ~$0.05...');

    const signerResult = await addSigner(PRIVATE_KEY);
    console.log('✅ Signer added:', signerResult.signerPrivateKey.slice(0, 20) + '...');

    // Wait for hub sync
    console.log('\n⏳ Waiting for hub to sync (30 seconds)...');
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Step 4: Post first cast
    console.log('\n📤 Step 4: Posting first cast...');

    if (usdcBalance < parseUnits('0.01', 6)) {
      console.log('⚠️  Need USDC on Base for posting (x402 payment)');
      console.log('Minimum: 0.01 USDC');
      console.log('You have:', formatUnits(usdcBalance, 6), 'USDC');

      const creds = {
        fid: fidStr,
        custodyPrivateKey: PRIVATE_KEY,
        signerPrivateKey: signerResult.signerPrivateKey,
        archetype,
        step: 'need_base_usdc'
      };
      fs.writeFileSync('setup-progress.json', JSON.stringify(creds, null, 2));

      console.log('\nProgress saved to setup-progress.json');
      console.log('After getting USDC, run: node complete-setup.js');
      process.exit(0);
    }

    const castResult = await postCast({
      privateKey: PRIVATE_KEY,
      signerPrivateKey: signerResult.signerPrivateKey,
      fid: fidNum,
      text: `gm! I'm a ${archetype} AI agent 🤖 Exploring Farcaster!`
    });

    console.log('✅ First cast posted!');
    console.log('Hash:', castResult.hash);

    // Step 5: Setup profile
    console.log('\n👤 Step 5: Setting up profile...');
    // Farcaster fname: 1-16 chars, lowercase alphanumeric + hyphens, cannot start with hyphen
    const suffix = Date.now().toString().slice(-5);
    const username = `${archetype}-${suffix}`.slice(0, 16);

    await setupFullProfile({
      privateKey: PRIVATE_KEY,
      signerPrivateKey: signerResult.signerPrivateKey,
      fid: fidNum,
      fname: username,
      displayName: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Agent`,
      bio: `Autonomous ${archetype} personality agent 🧠🤖`,
      pfpUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${username}`
    });

    console.log('✅ Profile setup complete!');

    // Save credentials (use fidStr so JSON doesn't hit BigInt)
    const credentials = {
      fid: fidStr,
      custodyPrivateKey: PRIVATE_KEY,
      signerPrivateKey: signerResult.signerPrivateKey,
      username,
      archetype,
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync('credentials.json', JSON.stringify(credentials, null, 2));

    const envAddition = `
FID=${fidStr}
SIGNER_PRIVATE_KEY=${signerResult.signerPrivateKey}
USERNAME=${username}
ARCHETYPE=${archetype}
HUB_URL=hub-grpc.pinata.cloud
FC_NETWORK=MAINNET
`;
    fs.appendFileSync('.env', envAddition);

    console.log('\n🎉 SETUP COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Profile: https://warpcast.com/${username}`);
    console.log(`First cast: https://warpcast.com/~/conversations/${castResult.hash}`);
    console.log('\n🚀 Start your agent:');
    console.log(`   node run.js ${archetype}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (fs.existsSync('setup-progress.json')) {
      fs.unlinkSync('setup-progress.json');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);

    if (error.fid !== undefined || error.signerPrivateKey !== undefined) {
      fs.writeFileSync('setup-progress.json', JSON.stringify({
        error: error.message,
        partialData: {
          fid: error.fid?.toString?.(),
          signerPrivateKey: error.signerPrivateKey
        }
      }, null, 2));
    }

    process.exit(1);
  }
}

const archetype = process.argv[2] || 'explorer';
const validArchetypes = ['explorer', 'achiever', 'guardian', 'connector', 'maverick'];
if (!validArchetypes.includes(archetype)) {
  console.error(`❌ Invalid archetype: ${archetype}. Use: ${validArchetypes.join(', ')}`);
  process.exit(1);
}

manualSetup(archetype);
