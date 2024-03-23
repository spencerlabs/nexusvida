import { notFound } from 'next/navigation'

import { getDatasetBySlug, getDatasetSlugs } from '@/app/api/datasets/route'
import markdownToHtml from '@/lib/markdownToHtml'
import Link from 'next/link'

type Params = {
  params: {
    slug: string
  }
}

export default async function Dataset({ params }: Params) {
  const dataset = getDatasetBySlug(params.slug)

  if (!dataset) {
    return notFound()
  }

  const content = await markdownToHtml(dataset.content || '')

  const countries = dataset.countries
    ? [...dataset.countries].filter((c) => c.data[dataset.slug])
    : []

  return (
    <article>
      <header className="mb-8 text-center">
        <h1 className="mb-1">{dataset.title}</h1>

        <p className="mx-auto w-full max-w-md text-center text-xs">
          Source ({dataset.year}):{' '}
          <Link
            href={dataset.url}
            target="_blank"
            className="underline hover:no-underline"
          >
            {dataset.source}
          </Link>
        </p>
      </header>

      <div dangerouslySetInnerHTML={{ __html: content }} />

      <table className="mx-auto w-full max-w-md select-none">
        <thead>
          <tr className="grid grid-cols-[44px_1fr] gap-2 border-b-2 border-stone-400 px-2 py-2 text-xs font-bold uppercase dark:border-stone-600">
            <th>Rank</th>
            <th className="text-left">Name</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-400 dark:divide-stone-600">
          {countries.map((country, i) => (
            <tr
              key={country.slug}
              className="relative grid grid-cols-[44px_1fr] items-center gap-2 px-2 py-2 text-lg transition-colors hover:bg-white dark:hover:bg-stone-950"
            >
              <td className="text-center text-sm font-bold">
                {i > 0 &&
                countries[i - 1].data[dataset.slug] ===
                  country.data[dataset.slug] ? (
                  <span className="sr-only">{country.data[dataset.slug]}</span>
                ) : (
                  country.data[dataset.slug]
                )}
              </td>
              <td className="">
                <Link
                  href={`/countries/${country.slug}`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  <span aria-hidden className="mr-2">
                    {country.icon}
                  </span>
                  <span>{country.title}</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}

export async function generateStaticParams() {
  const datasets = getDatasetSlugs()

  return datasets.map((slug) => ({
    slug,
  }))
}
