import Link from 'next/link'
import { notFound } from 'next/navigation'

import Filters from '@/components/Filters'
import Table from '@/components/Table'
import { getDatasetBySlug, getDatasetSlugs } from '@/lib/api'
import { createSearchParams } from '@/lib/createSearchParams'
import markdownToHtml from '@/lib/markdownToHtml'
import { recent } from '@/lib/recent'

import type { Metadata } from 'next'

type Params = {
  params: {
    slug: string
  }
  searchParams: {
    orderBy?: string
    order?: string
    query?: string
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const dataset = getDatasetBySlug(params.slug)

  return {
    title: `${dataset.title} | Datasets`,
  }
}

export default async function Dataset({ params, searchParams }: Params) {
  const dataset = getDatasetBySlug(params.slug)

  if (!dataset) return notFound()

  const content = await markdownToHtml(dataset.content || '')

  const recentlyAdded = recent(dataset.added)
  const recentlyUpdated = recent(dataset.updated)

  return (
    <article className="mx-auto w-full max-w-md">
      <header className="mb-8 space-y-1 text-center">
        {(recentlyAdded || recentlyUpdated) && (
          <span
            className={`${recentlyAdded ? 'bg-sky-300 dark:bg-sky-700' : 'bg-amber-300 dark:bg-amber-700'} inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase leading-none`}
          >
            {recentlyAdded ? 'New' : 'Updated'}
          </span>
        )}

        <h1 id="table-label">{dataset.title}</h1>

        <p className="text-xs">
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

      <Filters searchOnly />

      <Table
        aria-labelledby="table-label"
        searchParams={createSearchParams(searchParams)}
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
