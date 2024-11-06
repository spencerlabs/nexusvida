'use client'

import { Suspense } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebouncedCallback } from 'use-debounce'

interface SearchProps extends React.ComponentPropsWithoutRef<'input'> {}

function SearchInner({ id, onChange, ...rest }: SearchProps) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const fieldId = id || 'search'

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <>
      <label htmlFor={fieldId} className="sr-only">
        Search
      </label>
      <input
        {...rest}
        id={fieldId}
        type="search"
        onChange={(e) => {
          if (onChange) onChange(e)
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
        autoComplete="off"
        placeholder="Search countries..."
      />
    </>
  )
}

export default function Search(props: SearchProps) {
  return (
    <Suspense>
      <SearchInner {...props} />{' '}
    </Suspense>
  )
}
