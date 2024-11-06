import Filters from '@/components/Filters'
import Table from '@/components/Table'

export default async function Home() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 space-y-1 text-center">
        <h1 id="table-label">Rankings</h1>
      </div>

      <Filters />

      <Table aria-labelledby="table-label" />
    </div>
  )
}
