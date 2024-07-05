import Filters from '@/components/Filters'
import Table from '@/components/Table'
import { createSearchParams } from '@/lib/createSearchParams'

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const newSearchParams = createSearchParams(searchParams)

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 space-y-1 text-center">
        <h1 id="table-label">Rankings</h1>
      </div>

      <Filters />

      <Table aria-labelledby="table-label" searchParams={newSearchParams} />
    </div>
  )
}
