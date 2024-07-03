import Link from 'next/link'
import { notFound } from 'next/navigation'

import DataProvider from '@/components/DataProvider'
import Table from '@/components/Table'
import { getContinentBySlug, getContinentSlugs } from '@/lib/api'
import markdownToHtml from '@/lib/markdownToHtml'

import type { Metadata } from 'next'

type Params = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const continent = getContinentBySlug(params.slug)

  return {
    title: `${continent.title} | Continents`,
  }
}

export default async function ContinentPage({ params }: Params) {
  const continent = getContinentBySlug(params.slug)

  if (!continent) return notFound()

  const content = await markdownToHtml(continent.content || '')

  const countries = continent.countries!.sort((a, b) => a.ranking - b.ranking)

  return (
    <DataProvider initialData={countries}>
      <article className="mx-auto w-full max-w-md">
        <header className="mb-8 space-y-1 text-center">
          <h1 id="table-label">{continent.title}</h1>

          <p className="text-xs">
            NexusVida API:{' '}
            <Link
              href={`/api/continents/${continent.slug}`}
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
  const continents = getContinentSlugs()

  return continents.map((slug) => ({
    slug,
  }))
}
