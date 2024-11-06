import { Fragment } from 'react'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'

import type { Metadata } from 'next'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const country = await prisma.country.findUnique({
    where: { id: params.id },
  })

  if (!country) notFound()

  return {
    title: `${country.name} | Countries`,
  }
}

export default async function Country(props: Params) {
  const params = await props.params;
  const country = await prisma.country.findUnique({
    where: { id: params.id },
    include: {
      continents: {
        select: {
          id: true,
          name: true,
        },
      },
      datasets: {
        orderBy: {
          value: 'asc',
        },
        select: {
          value: true,
          dataset: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  if (!country) notFound()

  return (
    <article className="mx-auto w-full max-w-4xl">
      <header className="mb-8 space-y-2 text-center">
        <h1 className="">
          <span aria-hidden className="mr-2">
            {country.icon}
          </span>
          {country.name}
        </h1>

        <p className="text-sm">
          View how {country.name} compares to the rest of{' '}
          {country.continents.map((c, i) => (
            <Fragment key={c.id}>
              {i > 0 ? ' or ' : ''}
              <Link href={`/?continent=${c.id}`} className="underline">
                {c.name}
              </Link>
            </Fragment>
          ))}
        </p>
      </header>

      <h2 className="sr-only">Rankings</h2>
      <section className="grid w-full gap-4 md:grid-cols-3 lg:grid-cols-4">
        {country.datasets.map((dataset) => (
          <dl
            key={dataset.dataset.id}
            className="relative flex flex-col items-center justify-start gap-1 rounded-md border p-4 text-center transition-colors hover:bg-white dark:hover:bg-stone-950"
          >
            <dt className="text-3xl font-bold leading-none">
              {dataset.value || '--'}
            </dt>
            <dd>
              <Link
                href={`/datasets/${dataset.dataset.id}`}
                className="block font-medium leading-tight text-stone-700 after:absolute after:inset-0 dark:text-stone-300"
              >
                {dataset.dataset.name}
              </Link>
            </dd>
          </dl>
        ))}
      </section>
    </article>
  )
}

export async function generateStaticParams() {
  const countries = await prisma.country.findMany()

  return countries.map((country) => ({
    id: country.id,
  }))
}
