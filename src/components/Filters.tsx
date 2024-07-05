import FilterField from '@/components/FilterField'
import FilterPopup from '@/components/FilterPopup'
import Search from '@/components/Search'
import { getAllContinents, getAllDatasets } from '@/lib/api'

type FiltersProps = {
  searchOnly?: boolean
}

export default function Filters({ searchOnly }: FiltersProps) {
  const datasets = getAllDatasets()
  const continents = getAllContinents()

  return (
    <div className="mb-2 grid grid-cols-[1fr_max-content] gap-2">
      <Search className={searchOnly ? 'col-span-2' : undefined} />

      {!searchOnly && (
        <FilterPopup>
          <FilterField
            name="dataset"
            label="Datasets"
            options={datasets.map((d) => ({
              label: d.title,
              value: d.slug,
            }))}
          />
          <FilterField
            name="continent"
            label="Continents"
            options={continents.map((c) => ({
              label: c.title,
              value: c.slug,
            }))}
          />
        </FilterPopup>
      )}
    </div>
  )
}
