'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { NextResponse } from 'next/server'

import { GET } from '@/app/api/rankings/route'
import SortButton from '@/components/SortButton'

type ExtractJsonResponseType<
  T extends (...args: any) => Promise<NextResponse>,
> =
  Awaited<ReturnType<T>> extends NextResponse<infer JsonType> ? JsonType : never

interface TableProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  dataset?: string
}

export default function Table({ dataset, ...props }: TableProps) {
  const searchParams = useSearchParams()

  const [countries, setCountries] = useState<
    ExtractJsonResponseType<typeof GET>['countries'] | null
  >(null)

  const readableSearchParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  )

  const orderBy = readableSearchParams.get('orderBy')
  const order = readableSearchParams.get('order')

  if (dataset) {
    readableSearchParams.set('dataset', dataset)
  }

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(
        `/api/rankings?${readableSearchParams.toString()}`,
      )
      const data = await (response as Awaited<ReturnType<typeof GET>>).json()
      setCountries(data.countries)
    }

    fetchCountries()
  }, [readableSearchParams, dataset])

  return (
    <div
      {...props}
      role="table"
      className="grid w-full select-none grid-cols-[max-content_1fr_max-content] gap-x-2"
    >
      <div
        role="rowgroup"
        className="sticky top-12 z-10 col-span-full grid grid-cols-subgrid"
      >
        <div
          role="row"
          className="col-span-full grid grid-cols-subgrid border-b-2 bg-stone-100 text-xs font-bold uppercase dark:bg-stone-900"
        >
          <Suspense>
            <SortButton className="text-left" orderBy="ranking">
              Rank
            </SortButton>
            <SortButton className="text-center" orderBy="name">
              Name
            </SortButton>
          </Suspense>
          <div role="columnheader" className="p-2">
            Score
          </div>
        </div>
      </div>
      <div role="rowgroup" className="col-span-full grid grid-cols-subgrid">
        {countries ? (
          countries.length > 0 &&
          countries.map((country, i) => (
            <div
              key={country.id}
              role="row"
              className={`${i !== countries.length - 1 ? 'border-b ' : ''}${i !== countries.length - 1 && country.ranking && country.ranking < 11 && countries[i + 1].ranking && countries[i + 1].ranking! > 10 && (!orderBy || (orderBy === 'ranking' && order !== 'desc')) ? 'border-yellow-400 dark:border-yellow-600 ' : ''}relative col-span-full grid grid-cols-subgrid text-lg transition-colors hover:bg-white dark:hover:bg-stone-950`}
            >
              <div
                role="cell"
                className="block p-2 text-center text-sm font-bold"
              >
                {i > 0 &&
                country.ranking &&
                country.ranking === countries[i - 1].ranking ? (
                  <span className="sr-only">{country.ranking}</span>
                ) : (
                  country.ranking || '--'
                )}
              </div>
              <div role="cell">
                <Link
                  key={`${country.id}-name`}
                  href={`/countries/${country.id}`}
                  className="flex p-2 leading-tight after:absolute after:inset-0"
                >
                  <span aria-hidden className="mr-2">
                    {country.icon}
                  </span>
                  <span>{country.name}</span>
                </Link>
              </div>
              <div
                role="cell"
                className="block p-2 text-center text-sm font-bold"
              >
                {country.score}
              </div>
            </div>
          ))
        ) : (
          <div
            role="row"
            className="col-span-full grid p-2 text-center text-lg"
          >
            Loading...
          </div>
        )}
      </div>
    </div>
  )
}
