import { notFound } from 'next/navigation'

import ArticleItem from '@/components/ArticleItem'
import { getAllDatasets } from '@/lib/api'

export default function DatasetsPage() {
  const datasets = getAllDatasets()

  if (datasets.length === 0) {
    return notFound()
  }
  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="mb-8 text-center">Datasets</h1>

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
