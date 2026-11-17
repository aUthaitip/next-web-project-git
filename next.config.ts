import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = (process.env.GO_API_URL || 'http://localhost:8080/api').replace(/\/$/, '')
    if (process.env.VERCEL && !process.env.GO_API_URL) {
      throw new Error('Set GO_API_URL to the deployed Go API URL (including /api) before deploying to Vercel.')
    }
    return [{ source: '/api/go/:path*', destination: `${apiUrl}/:path*` }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
