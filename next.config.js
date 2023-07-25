/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    POKE_API_URL: process.env.POKE_API_URL,
    POKEMON_IMAGES_URL: process.env.POKEMON_IMAGES_URL,
    POKEMON_IMAGES_LOW_QUALITY_URL: process.env.POKEMON_IMAGES_LOW_QUALITY_URL,
    POKEMON_ANIMATED_GIF_URL: process.env.POKEMON_ANIMATED_GIF_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com'
      }
    ]
  }
}

module.exports = nextConfig
