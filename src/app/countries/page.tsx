import { notFound } from 'next/navigation'

import ArticleItem from '@/components/ArticleItem'
import { getAllCountries } from '@/lib/api'

export default function CountriesPage() {
  const countries = getAllCountries()

  if (countries.length === 0) {
    return notFound()
  }
  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="mb-8 text-center">Countries</h1>

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
