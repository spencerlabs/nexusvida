import Link from 'next/link'
import { notFound } from 'next/navigation'

import ArticleItem from '@/components/ArticleItem'
import { getAllCountries } from '@/lib/api'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Countries',
}

export default function CountriesPage() {
  const countries = getAllCountries()

  if (countries.length === 0) return notFound()

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8 space-y-1 text-center">
        <h1>Countries</h1>

        <p className="text-xs">
          NexusVida API:{' '}
          <Link
            href="/api/countries"
            target="_blank"
            className="underline hover:no-underline"
          >
            Raw Data
          </Link>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {countries.map((country) => (
          <ArticleItem key={country.slug} href={`/countries/${country.slug}`}>
            <span aria-hidden className="mr-2 text-2xl">
              {country.icon}
            </span>
            {country.title}
          </ArticleItem>
        ))}
      </div>
    </div>
  )
}
