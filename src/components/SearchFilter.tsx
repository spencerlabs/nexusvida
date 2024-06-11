'use client'

import { useData } from './DataProvider'

const SearchFilter = () => {
  const { data, search, setSearch, total } = useData()

  return (
    <div className="mb-1">
      <div>
        <label
          htmlFor="search-filter"
          className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-400"
        >
          Search for country:
        </label>
        <input
          id="search-filter"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-sm bg-stone-300 px-3 py-1 dark:bg-stone-700"
          autoComplete="off"
        />
      </div>

      <p className="mt-1 text-right text-xs font-medium text-stone-600 dark:text-stone-400">
        {data.length !== total ? `${data.length} of ${total}` : total} countries
      </p>
    </div>
  )
}

export default SearchFilter
