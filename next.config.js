/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/store',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig