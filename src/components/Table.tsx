'use client'

import Link from 'next/link'

import SortButton from './SortButton'
import { useData } from './DataProvider'
import SearchFilter from './SearchFilter'

interface TableProps extends React.ComponentPropsWithoutRef<'div'> {
  showScore?: boolean
}

const Table = ({ showScore, ...props }: TableProps) => {
  const { data, sort } = useData()

  let gridTemplateColumns = 'max-content 1fr'

  if (showScore) gridTemplateColumns += ' max-content'

  return (
    <div>
      <SearchFilter />

      <div
        {...props}
        role="table"
        className="grid w-full select-none gap-x-2"
        style={{ gridTemplateColumns }}
      >
        <div
          role="rowgroup"
          className="sticky top-12 z-10 col-span-full grid grid-cols-subgrid"
        >
          <div
            role="row"
            className="col-span-full grid grid-cols-subgrid border-b-2 border-stone-400 bg-stone-100 text-xs font-bold uppercase dark:border-stone-600 dark:bg-stone-900"
          >
            <div
              role="columnheader"
              aria-sort={
                sort.by === 'ranking'
                  ? sort.order === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              }
            >
              <SortButton className="text-left" sortByString="ranking">
                Rank
              </SortButton>
            </div>
            <div
              role="columnheader"
              aria-sort={
                sort.by === 'title'
                  ? sort.order === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              }
            >
              <SortButton className="text-center" sortByString="title">
                Name
              </SortButton>
            </div>
            {showScore && (
              <div role="columnheader" className="p-2">
                Score
              </div>
            )}
          </div>
        </div>
        <div role="rowgroup" className="col-span-full grid grid-cols-subgrid">
          {data.length > 0 &&
            data.map((country, i) => (
              <div
                key={country.slug}
                role="row"
                className={`${i !== data.length - 1 ? 'border-b ' : ''}${i !== data.length - 1 && country.ranking < 11 && data[i + 1].ranking > 10 && sort.by === 'ranking' && sort.order === 'asc' ? 'border-yellow-400 dark:border-yellow-600' : 'border-stone-400 dark:border-stone-600'} relative col-span-full grid grid-cols-subgrid text-lg transition-colors hover:bg-white dark:hover:bg-stone-950`}
              >
                <div
                  role="cell"
                  className="block p-2 text-center text-sm font-bold"
                >
                  {i > 0 && country.ranking && country.ranking === data[i - 1].ranking ? (
                    <span className="sr-only">{country.ranking}</span>
                  ) : (
                    country.ranking || '--'
                  )}
                </div>
                <div role="cell">
                  <Link
                    key={`${country.slug}-name`}
                    href={`/countries/${country.slug}`}
                    className="flex p-2 leading-tight after:absolute after:inset-0"
                  >
                    <span aria-hidden className="mr-2">
                      {country.icon}
                    </span>
                    <span>{country.title}</span>
                  </Link>
                </div>
                {showScore && (
                  <div
                    role="cell"
                    className="block p-2 text-center text-sm font-bold"
                  >
                    {country.score}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Table
