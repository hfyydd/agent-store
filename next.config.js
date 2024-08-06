/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['mfyamxpbtxomfcputjzs.supabase.co'],
  },
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