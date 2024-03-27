'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { getNexusVidaRankings } from '@/lib/api'
import { Country } from '@/interfaces/country'

interface DataContextProps {
  data: ReturnType<typeof getNexusVidaRankings>
  sort: { by: string; order: 'asc' | 'desc' }
  setSort: React.Dispatch<
    React.SetStateAction<{ by: string; order: 'asc' | 'desc' }>
  >
}

const DataContext = createContext<DataContextProps>({
  data: [],
  sort: { by: 'ranking', order: 'asc' },
  setSort: () => {},
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

  useEffect(() => {
    setData([
      ...initialData.sort((a, b) => {
        const aVal = a[sort.by as keyof Omit<Country, 'content' | 'data'>]
        const bVal = b[sort.by as keyof Omit<Country, 'content' | 'data'>]

        if (sort.order === 'desc') return aVal > bVal ? -1 : 1

        return aVal < bVal ? -1 : 1
      }),
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  return (
    <DataContext.Provider value={{ data, sort, setSort }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

export default DataProvider
