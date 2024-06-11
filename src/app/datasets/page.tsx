import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import ArticleItem from '@/components/ArticleItem'
import { getAllDatasets } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Datasets',
}

export default function DatasetsPage() {
  const datasets = getAllDatasets()

  if (datasets.length === 0) return notFound()

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8 space-y-1 text-center">
        <h1>Datasets</h1>

        <p className="text-xs">
          NexusVida API:{' '}
          <Link
            href="/api/datasets"
            target="_blank"
            className="underline hover:no-underline"
          >
            Raw Data
          </Link>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {datasets.map((dataset) => {
          const recentlyAdded =
            (new Date().getTime() - new Date(dataset.added).getTime()) /
              1000 /
              60 /
              60 /
              24 <
            60

          const recentlyUpdated =
            (new Date().getTime() - new Date(dataset.updated).getTime()) /
              1000 /
              60 /
              60 /
              24 <
            60

          return (
            <ArticleItem key={dataset.slug} href={`/datasets/${dataset.slug}`}>
              <span className="block py-1">
                {(recentlyAdded || recentlyUpdated) && (
                  <span
                    className={`${recentlyAdded ? 'bg-sky-300 dark:bg-sky-700' : 'bg-amber-300 dark:bg-amber-700'} absolute -right-1 -top-2 inline-block rounded-full px-2 text-xs font-semibold uppercase group-hover:text-stone-950 dark:group-hover:text-stone-50`}
                  >
                    {recentlyAdded ? 'New' : 'Updated'}
                    <span className="sr-only">:</span>
                  </span>
                )}
                {dataset.title}
              </span>
            </ArticleItem>
          )
        })}
      </div>
    </div>
  )
}
