'use client'

import { TbArrowsSort, TbArrowUp, TbArrowDown } from 'react-icons/tb'

import { useData } from './DataProvider'

interface SortButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  sortByString: string
}

const SortButton = ({
  children,
  className,
  sortByString,
  ...props
}: SortButtonProps) => {
  const { sort, setSort } = useData()

  const Icon =
    sort.by !== sortByString || !sort
      ? TbArrowsSort
      : sort.order === 'asc'
        ? TbArrowUp
        : TbArrowDown

  return (
    <button
      {...props}
      className={`${className ? className + ' ' : ''}flex w-full items-center space-x-1  p-2 uppercase transition-colors hover:text-sky-700 dark:hover:text-sky-300`}
      onClick={() => {
        if (sort.by !== sortByString) {
          setSort({ by: sortByString, order: 'asc' })
          return
        }

        setSort({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })
      }}
    >
      <span>{children}</span>
      <Icon aria-hidden className="h-3 w-3" />
    </button>
  )
}

export default SortButton
