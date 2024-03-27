import { notFound } from 'next/navigation'
import Link from 'next/link'

import Table from '@/components/Table'
import { getDatasetBySlug, getDatasetSlugs } from '@/lib/api'
import markdownToHtml from '@/lib/markdownToHtml'
import DataProvider from '@/components/DataProvider'
import { Country } from '@/interfaces/country'

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
    ? [...dataset.countries]
        .filter((c) => c.data[dataset.slug])
        .reduce(
          (prev, current, i) => {
            // Add ranking to dataset
            let ranking = i + 1

            if (
              i > 0 &&
              current.data[params.slug] ===
                prev[prev.length - 1].data[params.slug]
            ) {
              ranking = prev[prev.length - 1].ranking
            }

            return [
              ...prev,
              {
                ...current,
                ranking,
              },
            ]
          },
          [] as (Omit<Country, 'content'> & {
            ranking: number
          })[],
        )
    : []

  return (
    <DataProvider initialData={countries}>
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

        <Table aria-labelledby="table-label" />
      </article>
    </DataProvider>
  )
}

export async function generateStaticParams() {
  const datasets = getDatasetSlugs()

  return datasets.map((slug) => ({
    slug,
  }))
}
