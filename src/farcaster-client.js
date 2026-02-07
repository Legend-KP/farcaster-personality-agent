/**
 * Post a cast using Neynar's HTTP API with x402 payment (no gRPC, no SSL/DNS issues).
 * Requires custody private key (for USDC payment on Base) and signer key.
 */
const { Wallet, JsonRpcProvider } = require('ethers');
const { randomBytes } = require('ethers');
const { hexToBytes } = require('@noble/hashes/utils');
const {
  makeCastAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  Message,
} = require('@farcaster/hub-nodejs');
const https = require('https');

const NEYNAR_HUB = 'hub-api.neynar.com';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const PAY_TO = '0xA6a8736f18f383f1cc2d938576933E5eA7Df01A1';
const PAYMENT_AMOUNT = 1000n; // 0.001 USDC (6 decimals)

const EIP712_USDC = {
  name: 'USD Coin',
  version: '2',
  chainId: 8453,
  verifyingContract: USDC_BASE,
};

const EIP712_TYPES = {
  TransferWithAuthorization: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' },
  ],
};

async function createX402Header(wallet) {
  const nonce = '0x' + Buffer.from(randomBytes(32)).toString('hex');
  const validBefore = BigInt(Math.floor(Date.now() / 1000) + 3600);

  const signature = await wallet.signTypedData(
    EIP712_USDC,
    EIP712_TYPES,
    {
      from: wallet.address,
      to: PAY_TO,
      value: PAYMENT_AMOUNT,
      validAfter: 0n,
      validBefore,
      nonce,
    }
  );

  const payload = {
    x402Version: 1,
    scheme: 'exact',
    network: 'base',
    payload: {
      signature,
      authorization: {
        from: wallet.address,
        to: PAY_TO,
        value: PAYMENT_AMOUNT.toString(),
        validAfter: '0',
        validBefore: validBefore.toString(),
        nonce,
      },
    },
  };

  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * @param {Object} options
 * @param {number} options.fid
 * @param {string} options.signerPrivateKey - hex, with or without 0x
 * @param {string} options.text
 * @param {string} options.privateKey - custody wallet key (for x402)
 * @returns {Promise<{ hash: string, url: string }>}
 */
async function postCast(options) {
  const { fid, signerPrivateKey, text, privateKey } = options;

  if (!privateKey) {
    throw new Error('postCast requires privateKey (custody wallet) for Neynar x402 payment');
  }

  const fidNum = Number(fid);
  const signerKey = signerPrivateKey.startsWith('0x')
    ? signerPrivateKey.slice(2)
    : signerPrivateKey;
  const signerBytes = hexToBytes(signerKey);
  const ed25519Signer = new NobleEd25519Signer(signerBytes);

  const network =
    (options.network || process.env.FC_NETWORK || 'MAINNET').toUpperCase() === 'TESTNET'
      ? FarcasterNetwork.TESTNET
      : FarcasterNetwork.MAINNET;

  const castResult = await makeCastAdd(
    {
      text: (text || '').slice(0, 320),
      embeds: [],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
    },
    { fid: fidNum, network },
    ed25519Signer
  );

  if (castResult.isErr()) {
    throw new Error(`makeCastAdd failed: ${castResult.error.message}`);
  }

  const cast = castResult.value;
  const messageBytes = Buffer.from(Message.encode(cast).finish());

  const baseProvider = new JsonRpcProvider('https://mainnet.base.org');
  const wallet = new Wallet(privateKey, baseProvider);
  const paymentHeader = await createX402Header(wallet);

  const body = messageBytes;
  const path = '/v1/submitMessage';

  const result = await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: NEYNAR_HUB,
        port: 443,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': body.length,
          'X-PAYMENT': paymentHeader,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            try {
              const err = JSON.parse(data);
              reject(new Error(`Neynar API ${res.statusCode}: ${JSON.stringify(err)}`));
            } catch {
              reject(new Error(`Neynar API ${res.statusCode}: ${data}`));
            }
            return;
          }
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch {
            resolve({ data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  const hashHex = Buffer.from(cast.hash).toString('hex');
  const hash = `0x${hashHex}`;
  const url = `https://warpcast.com/~/conversations/${hash}`;

  return { hash, url };
}

module.exports = { postCast };
