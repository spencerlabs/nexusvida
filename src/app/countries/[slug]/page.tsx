import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getAllDatasets, getCountryBySlug, getCountrySlugs } from '@/lib/api'
import markdownToHtml from '@/lib/markdownToHtml'

type Params = {
  params: {
    slug: string
  }
}

export default async function Country({ params }: Params) {
  const country = getCountryBySlug(params.slug)

  if (!country) {
    return notFound()
  }

  const datasets = getAllDatasets()

  const content = await markdownToHtml(country.content || '')

  const data = Object.entries(country.data)
    .sort(([, a], [, b]) => {
      if (a === b) return 0

      if (a === null) return 1
      if (b === null) return -1

      return a - b
    })
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

  return (
    <article>
      <header className="mb-8">
        <h1 className="flex items-center justify-center">
          <span aria-hidden className="mr-2">
            {country.icon}
          </span>
          {country.title}
        </h1>
      </header>

      <h2 className="sr-only">Rankings</h2>
      <section className="mx-auto grid w-full max-w-4xl grid-cols-4 gap-4">
        {Object.keys(data).map((dataset) => (
          <dl
            key={dataset}
            className="relative flex flex-col items-center justify-start gap-1 rounded-md border border-stone-400 p-4 text-center transition-colors hover:bg-white dark:border-stone-600 dark:hover:bg-stone-950"
          >
            <dt className="text-3xl font-bold leading-none">
              {country.data[dataset] || '--'}
            </dt>
            <dd>
              <Link
                href={`/datasets/${dataset}`}
                className="block font-medium leading-tight text-stone-700 after:absolute after:inset-0 after:content-[''] dark:text-stone-300"
              >
                {datasets.find((d) => d.slug === dataset)!.title}
              </Link>
            </dd>
          </dl>
        ))}
      </section>

      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}

export async function generateStaticParams() {
  const countries = getCountrySlugs()

  return countries.map((slug) => ({
    slug,
  }))
}
