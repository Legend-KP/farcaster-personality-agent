/**
 * Setup script: creates a wallet and guides you to register on Farcaster,
 * then saves credentials for the agent.
 *
 * Usage: node setup.js <archetype>
 *   archetype: explorer | achiever | guardian | connector | maverick
 *
 * Optional: If you have OpenClaw and the farcaster-agent skill installed:
 *   openclaw skills install rishavmukherji/farcaster-agent
 *   Then use that skill's autoSetup/setupFullProfile and copy FID + signer key here.
 */

const { Wallet } = require('ethers');
const readline = require('readline');
const { saveCredentials } = require('./src/credentials');
const { ARCHETYPES } = require('./src/personality/traits');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function setupAgent(archetypeName) {
  const archetype = ARCHETYPES[archetypeName];
  if (!archetype) {
    console.error('Unknown archetype. Use: explorer, achiever, guardian, connector, maverick');
    process.exit(1);
  }

  const wallet = Wallet.createRandom();

  console.log('\n=== WALLET CREATED ===');
  console.log('Address:', wallet.address);
  console.log('Private Key (custody):', wallet.privateKey);
  console.log('\n1. Send ~$1 USD worth of ETH or USDC to the address above.');
  console.log('   Supported chains: Ethereum, Optimism, Base, Arbitrum, Polygon');
  console.log('\n2. Register a Farcaster account using this wallet:');
  console.log('   - Go to https://warpcast.com and sign up, or');
  console.log('   - Use the Farcaster developer docs to create a signer and FID.');
  console.log('\n3. You will need your FID and the signer private key (Ed25519, hex).');
  console.log('   If using OpenClaw farcaster-agent: run its setup, then copy FID and signerPrivateKey from its output.\n');

  await question('Press Enter when you have funded and registered...');

  const fidInput = await question('Enter your FID: ');
  const fid = fidInput.trim();
  if (!fid) {
    console.error('FID is required.');
    rl.close();
    process.exit(1);
  }

  const signerKeyInput = await question('Enter signer private key (hex, with or without 0x): ');
  const signerPrivateKey = signerKeyInput.trim();
  if (!signerPrivateKey) {
    console.error('Signer private key is required.');
    rl.close();
    process.exit(1);
  }

  const credentials = {
    fid,
    signerPrivateKey: signerPrivateKey.startsWith('0x') ? signerPrivateKey : `0x${signerPrivateKey}`,
    custodyPrivateKey: wallet.privateKey,
  };

  saveCredentials(credentials);
  console.log('\n=== SETUP COMPLETE ===');
  console.log('Credentials saved to credentials.json');
  console.log('Profile: https://warpcast.com/~/profiles/' + fid);
  console.log('Run the agent: node run.js ' + archetypeName);
  rl.close();
}

const archetype = process.argv[2] || 'explorer';
setupAgent(archetype).catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
