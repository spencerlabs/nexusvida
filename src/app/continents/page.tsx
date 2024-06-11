import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import ArticleItem from '@/components/ArticleItem'
import { getAllContinents } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Continents',
}

export default function ContinentsPage() {
  const continents = getAllContinents()

  if (continents.length === 0) return notFound()

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8 space-y-1 text-center">
        <h1>Continents</h1>

        <p className="text-xs">
          NexusVida API:{' '}
          <Link
            href="/api/continents"
            target="_blank"
            className="underline hover:no-underline"
          >
            Raw Data
          </Link>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {continents.map((continent) => (
          <ArticleItem
            key={continent.slug}
            href={`/continents/${continent.slug}`}
          >
            {continent.title}
          </ArticleItem>
        ))}
      </div>
    </div>
  )
}
