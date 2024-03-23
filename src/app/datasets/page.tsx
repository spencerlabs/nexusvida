import { notFound } from 'next/navigation'

import { getAllDatasets } from '@/lib/api'
import Link from 'next/link'

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
          <article key={dataset.slug}>
            <h2 className="text-lg font-normal">
              <Link
                href={`/datasets/${dataset.slug}`}
                className="flex items-center rounded-xl bg-white px-3 py-1 transition-colors dark:bg-stone-950"
              >
                {dataset.title}
              </Link>
            </h2>
          </article>
        ))}
      </div>
    </div>
  )
}
