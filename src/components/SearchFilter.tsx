'use client'

import { useData } from './DataProvider'

const SearchFilter = () => {
  const { search, setSearch } = useData()

  return (
    <div className="mb-4">
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
  )
}

export default SearchFilter
