import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import ArticleItem from '@/components/ArticleItem'
import { getAllDatasets } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Datasets | NexusVida',
}

export default function DatasetsPage() {
  const datasets = getAllDatasets()

  if (datasets.length === 0) {
    return notFound()
  }
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
        {datasets.map((dataset) => (
          <ArticleItem key={dataset.slug} href={`/datasets/${dataset.slug}`}>
            {dataset.title}
          </ArticleItem>
        ))}
      </div>
    </div>
  )
}
