/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — marketing site has no server APIs yet.
  // Cloudflare Workers serves the `out/` directory as assets.
  output: "export",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
