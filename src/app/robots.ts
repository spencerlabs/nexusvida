import { MetadataRoute } from 'next'

import { site_url } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${site_url}/sitemap.xml`,
  }
}
