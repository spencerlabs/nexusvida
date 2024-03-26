import { notFound } from 'next/navigation'

import Table from '@/components/Table'
import { getDatasetBySlug, getDatasetSlugs } from '@/lib/api'
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
    <article className="mx-auto w-full max-w-md">
      <header className="mb-8 space-y-1 text-center">
        <h1 id="table-label">{dataset.title}</h1>

        <p className="text-xs">
          Source ({dataset.year}):{' '}
          <Link
            href={dataset.url}
            target="_blank"
            className="underline hover:no-underline"
          >
            {dataset.source}
          </Link>{' '}
          | NexusVida API:{' '}
          <Link
            href={`/api/datasets/${dataset.slug}`}
            target="_blank"
            className="underline hover:no-underline"
          >
            Raw Data
          </Link>
        </p>
      </header>

      {content && (
        <div
          className="mb-4 text-sm"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      <p className="mb-8 text-sm">
        <strong>Note:</strong> NexusVida only includes countries that are
        members of the United Nations in it&apos;s datasets. Any missing items
        in the rankings are most likely countries or territories from the
        original dataset that are not UN members.
      </p>

      <Table
        aria-labelledby="table-label"
        cols={[
          { label: 'Rank', width: '44px' },
          { label: 'Name', align: 'left' },
        ]}
        data={[
          ...countries.map((country, i) => [
            <span
              key={`${country.title}-rank`}
              className="block text-center text-sm font-bold"
            >
              {i > 0 &&
              countries[i - 1].data[dataset.slug] ===
                country.data[dataset.slug] ? (
                <span className="sr-only">{country.data[dataset.slug]}</span>
              ) : (
                country.data[dataset.slug]
              )}
            </span>,
            <Link
              key={`${country.title}-name`}
              href={`/countries/${country.slug}`}
              className="flex after:absolute after:inset-0 after:content-['']"
            >
              <span aria-hidden className="mr-2">
                {country.icon}
              </span>
              <span>{country.title}</span>
            </Link>,
          ]),
        ]}
      />
    </article>
  )
}

export async function generateStaticParams() {
  const datasets = getDatasetSlugs()

  return datasets.map((slug) => ({
    slug,
  }))
}
