import { Suspense } from 'react'

import Link from 'next/link'

import SortButton from '@/components/SortButton'
import { getCountryRankings } from '@/lib/api'

interface TableProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  searchParams?: URLSearchParams
}

export default async function Table({ searchParams, ...props }: TableProps) {
  const countries = await getCountryRankings(
    searchParams || new URLSearchParams(),
  )

  const orderBy = searchParams?.get('orderBy')
  const order = searchParams?.get('order')

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
            <SortButton className="text-center" orderBy="title">
              Name
            </SortButton>
          </Suspense>
          <div role="columnheader" className="p-2">
            Score
          </div>
        </div>
      </div>
      <div role="rowgroup" className="col-span-full grid grid-cols-subgrid">
        {countries.length > 0 &&
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
          ))}
      </div>
    </div>
  )
}
