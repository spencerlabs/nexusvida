import Link from 'next/link'

import DataProvider from '@/components/DataProvider'
import Table from '@/components/Table'
import { getNexusVidaRankings } from '@/lib/api'

export default async function Home() {
  const countries = getNexusVidaRankings()

  return (
    <DataProvider initialData={countries}>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 space-y-1 text-center">
          <h1 id="table-label">NexusVida Rankings</h1>

          <p className="text-xs">
            NexusVida API:{' '}
            <Link
              href="/api/rankings"
              target="_blank"
              className="underline hover:no-underline"
            >
              Raw Data
            </Link>
          </p>
        </div>

        <Table aria-labelledby="table-label" showScore />
      </div>
    </DataProvider>
  )
}
