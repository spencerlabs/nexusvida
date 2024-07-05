import { notFound } from 'next/navigation'

import ArticleItem from '@/components/ArticleItem'
import { prisma } from '@/lib/prisma'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Countries',
}

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  if (countries.length === 0) notFound()

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8 space-y-1 text-center">
        <h1>Countries</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {countries.map((country) => (
          <ArticleItem key={country.id} href={`/countries/${country.id}`}>
            <span aria-hidden className="mr-2 text-2xl">
              {country.icon}
            </span>
            {country.name}
          </ArticleItem>
        ))}
      </div>
    </div>
  )
}
