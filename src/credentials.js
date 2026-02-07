const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Load Farcaster credentials from credentials.json or env.
 * @returns {{ fid: string, signerPrivateKey: string, custodyPrivateKey?: string }}
 */
function loadCredentials() {
  if (process.env.FID && process.env.SIGNER_PRIVATE_KEY) {
    return {
      fid: process.env.FID,
      signerPrivateKey: process.env.SIGNER_PRIVATE_KEY,
      custodyPrivateKey: process.env.CUSTODY_PRIVATE_KEY,
    };
  }

  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      'No credentials found. Run: node setup.js <archetype>\n' +
        'Or set FID and SIGNER_PRIVATE_KEY in .env (see .env.example).'
    );
  }

  const data = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  if (!data.fid || !data.signerPrivateKey) {
    throw new Error(
      'credentials.json must contain fid and signerPrivateKey. Re-run setup.js.'
    );
  }
  return data;
}

/**
 * Save credentials to credentials.json (used by setup).
 */
function saveCredentials(credentials) {
  fs.writeFileSync(
    CREDENTIALS_PATH,
    JSON.stringify(credentials, null, 2),
    'utf8'
  );
}

module.exports = { loadCredentials, saveCredentials, CREDENTIALS_PATH };
