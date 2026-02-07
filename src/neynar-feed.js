/**
 * Fetch trending feed from Neynar (requires NEYNAR_API_KEY).
 * @returns {Promise<Array<{ fid: number, hash: string, text: string }>>}
 */
const https = require('https');

const NEYNAR_API = 'api.neynar.com';

function getTrendingFeed(limit = 20) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      reject(new Error('NEYNAR_API_KEY required for feed'));
      return;
    }

    const path = `/v2/farcaster/feed/trending?limit=${limit}`;
    const req = https.request(
      {
        hostname: NEYNAR_API,
        port: 443,
        path,
        method: 'GET',
        headers: { 'x-api-key': apiKey },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Neynar feed ${res.statusCode}: ${data.slice(0, 200)}`));
            return;
          }
          try {
            const json = JSON.parse(data);
            const casts = (json.casts || []).map((c) => ({
              fid: c.author?.fid ?? c.cast_id?.fid,
              hash: c.hash || c.cast_id?.hash || '',
              text: c.text || '',
            })).filter((c) => c.fid && c.hash);
            resolve(casts);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

module.exports = { getTrendingFeed };
