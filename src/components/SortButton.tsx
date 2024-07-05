'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { TbArrowsSort, TbArrowUp, TbArrowDown } from 'react-icons/tb'
import { useDebouncedCallback } from 'use-debounce'

interface SortButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  orderBy: string
}

const SortButton = ({
  children,
  className,
  orderBy,
  ...props
}: SortButtonProps) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const isCurrent = searchParams.get('orderBy')?.toString() === orderBy
  const order = searchParams.get('order')?.toString()

  const handleSort = useDebouncedCallback((order: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams)

    if (order) {
      params.set('orderBy', orderBy)
      params.set('order', order)
    } else {
      params.delete('orderBy')
      params.delete('order')
    }

    replace(`${pathname}?${params.toString()}`)
  }, 150)

  const Icon = !isCurrent
    ? TbArrowsSort
    : order === 'asc'
      ? TbArrowUp
      : TbArrowDown

  return (
    <div
      role="columnheader"
      aria-sort={
        isCurrent ? (order === 'asc' ? 'ascending' : 'descending') : undefined
      }
    >
      <button
        {...props}
        className={`${className ? className + ' ' : ''}flex w-full items-center space-x-1  p-2 uppercase transition-colors hover:text-sky-700 dark:hover:text-sky-300`}
        onClick={() =>
          handleSort(!isCurrent || order === 'desc' ? 'asc' : 'desc')
        }
      >
        <span>{children}</span>
        <Icon aria-hidden className="h-3 w-3" />
      </button>
    </div>
  )
}

export default SortButton
