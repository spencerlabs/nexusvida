import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { Metadata } from 'next'

import { getAllDatasets, getCountryBySlug, getCountrySlugs } from '@/lib/api'
import markdownToHtml from '@/lib/markdownToHtml'

type Params = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const country = getCountryBySlug(params.slug)

  return {
    title: `${country.title} | Countries`,
  }
}

export default async function Country({ params }: Params) {
  const country = getCountryBySlug(params.slug)

  if (!country) return notFound()

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
    <article className="mx-auto w-full max-w-4xl">
      <header className="mb-8 space-y-1 text-center">
        <h1 className="">
          <span aria-hidden className="mr-2">
            {country.icon}
          </span>
          {country.title}
        </h1>

        <p className="text-xs">
          NexusVida API:{' '}
          <Link
            href={`/api/countries/${country.slug}`}
            target="_blank"
            className="underline hover:no-underline"
          >
            Raw Data
          </Link>
        </p>
      </header>

      <h2 className="sr-only">Rankings</h2>
      <section className="grid w-full gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Object.keys(data).map((dataset) => (
          <dl
            key={dataset}
            className="relative flex flex-col items-center justify-start gap-1 rounded-md border p-4 text-center transition-colors hover:bg-white dark:hover:bg-stone-950"
          >
            <dt className="text-3xl font-bold leading-none">
              {country.data[dataset] || '--'}
            </dt>
            <dd>
              <Link
                href={`/datasets/${dataset}`}
                className="block font-medium leading-tight text-stone-700 after:absolute after:inset-0 dark:text-stone-300"
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
