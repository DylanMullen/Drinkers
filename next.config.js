/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['ca.slack-edge.com', 'cdn.discordapp.com', "upload.wikimedia.org", "source.boringavatars.com"],
  },
  env: {
    DB_CREDIENTIALS_ACCESS: process.env.DB_CREDIENTIALS_ACCESS ?? "",
    DB_CREDIENTIALS_SECRET: process.env.DB_CREDIENTIALS_SECRET ?? "",
    USE_LOCAL: process.env.USE_LOCAL ?? "false",
    LOCAL_IP: process.env.LOCAL_IP ?? "localhost",
    DISCORD_APP_ID: process.env.DISCORD_APP_ID ?? "",
    DISCORD_APP_SECRET: process.env.DISCORD_APP_SECRET ?? ""
  }
}

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// module.exports = withBundleAnalyzer({})

module.exports = nextConfig
