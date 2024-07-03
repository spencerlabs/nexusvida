'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Country } from '@/interfaces/country'
import { getNexusVidaRankings } from '@/lib/api'

interface DataContextProps {
  data: ReturnType<typeof getNexusVidaRankings>
  sort: { by: string; order: 'asc' | 'desc' }
  setSort: React.Dispatch<
    React.SetStateAction<{ by: string; order: 'asc' | 'desc' }>
  >
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  total: number
}

const DataContext = createContext<DataContextProps>({
  data: [],
  sort: { by: 'ranking', order: 'asc' },
  setSort: () => {},
  search: '',
  setSearch: () => {},
  total: 0,
})

interface DataProviderProps {
  children?: React.ReactNode
  initialData: ReturnType<typeof getNexusVidaRankings>
}

const DataProvider = ({ children, initialData }: DataProviderProps) => {
  const [data, setData] = useState(initialData)
  const [sort, setSort] = useState<{ by: string; order: 'asc' | 'desc' }>({
    by: 'ranking',
    order: 'asc',
  })
  const [search, setSearch] = useState('')

  const sortData = useCallback(() => {
    return [...initialData]
      .sort((a, b) => {
        const aVal = a[sort.by as keyof Omit<Country, 'content' | 'data'>]
        const bVal = b[sort.by as keyof Omit<Country, 'content' | 'data'>]

        if (sort.order === 'desc') return aVal > bVal ? -1 : 1

        return aVal < bVal ? -1 : 1
      })
      .filter((c) => {
        if (!search) return true

        return c.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      })
  }, [initialData, search, sort.by, sort.order])

  useEffect(() => {
    setData(sortData())
  }, [sortData])

  return (
    <DataContext.Provider
      value={{
        data,
        sort,
        setSort,
        search,
        setSearch,
        total: initialData.length,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

export default DataProvider
