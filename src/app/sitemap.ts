import { MetadataRoute } from 'next'

import { site_url } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await prisma.country.findMany()
  const datasets = await prisma.dataset.findMany()

  return [
    {
      url: site_url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${site_url}/datasets`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...datasets.map((d): MetadataRoute.Sitemap[number] => ({
      url: `${site_url}/datasets/${d.id}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    })),
    ...countries.map((c): MetadataRoute.Sitemap[number] => ({
      url: `${site_url}/countries/${c.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    {
      url: `${site_url}/countries`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]
}
