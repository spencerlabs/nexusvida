import { notFound } from 'next/navigation'

import { getAllCountries } from '@/app/api/countries/route'
import Link from 'next/link'

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
          <article key={country.slug}>
            <h2 className="text-lg font-normal">
              <Link
                href={`/countries/${country.slug}`}
                className="flex items-center rounded-xl bg-white px-3 py-1 transition-colors dark:bg-stone-950"
              >
                <span aria-hidden className="mr-2 text-2xl">
                  {country.icon}
                </span>
                {country.title}
              </Link>
            </h2>
          </article>
        ))}
      </div>
    </div>
  )
}
