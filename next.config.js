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
  async rewrites() {
    return [
      {
        source: '/dashboard/admin/:path*',
        destination: '/api/check-admin',
        has: [
          {
            type: 'header',
            key: 'x-is-admin-check',
          },
        ],
      },
      {
        source: '/dashboard/admin/:path*',
        destination: '/dashboard/admin/:path*',
      },
    ];
  },
}

module.exports = nextConfig