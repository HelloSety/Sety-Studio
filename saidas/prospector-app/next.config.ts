import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['baileys', '@hapi/boom'],
  },
}

export default config
