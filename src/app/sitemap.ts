import { MetadataRoute } from 'next'

import { getAllCountries, getAllDatasets } from '@/lib/api'
import { site_url } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const countries = getAllCountries()
  const datasets = getAllDatasets()

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
      url: `${site_url}/datasets/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    })),
    ...countries.map((c): MetadataRoute.Sitemap[number] => ({
      url: `${site_url}/countries/${c.slug}`,
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
