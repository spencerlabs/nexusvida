import FilterField from '@/components/FilterField'
import FilterPopup from '@/components/FilterPopup'
import Search from '@/components/Search'
import { prisma } from '@/lib/prisma'

type FiltersProps = {
  searchOnly?: boolean
}

export default async function Filters({ searchOnly }: FiltersProps) {
  const datasets = await prisma.dataset.findMany({
    orderBy: { name: 'asc' },
  })
  const continents = await prisma.continent.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="mb-2 grid grid-cols-[1fr_max-content] gap-2">
      <Search className={searchOnly ? 'col-span-2' : undefined} />

      {!searchOnly && (
        <FilterPopup>
          <FilterField
            name="dataset"
            label="Datasets"
            options={datasets.map((d) => ({
              label: d.name,
              value: d.id,
            }))}
          />
          <FilterField
            name="continent"
            label="Continents"
            options={continents.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />
        </FilterPopup>
      )}
    </div>
  )
}
