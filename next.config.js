/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: "build",
  basePath: process.env.NEXT_BASE_PATH || undefined,
};

module.exports = nextConfig;
