import Link from 'next/link'

import Table from '@/components/Table'
import { getAllCountries } from '@/lib/api'

export default async function Home() {
  const countries = getAllCountries()
    .filter((c) => {
      const { col, gdp, gpi, hdi, whr } = c.data

      if (!col || !gdp || !gpi || !hdi || !whr) return false

      return true
    })
    .map((c) => {
      const dataArr = Object.values(c.data)
      const score = dataArr.reduce((sum, a) => sum + a, 0) / dataArr.length

      return { ...c, score }
    })
    .sort((a, b) => (a.score < b.score ? -1 : 1))

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 id="table-label" className="mb-8 text-center">
        NexusVida Rankings
      </h1>

      <Table
        aria-labelledby="table-label"
        cols={[
          { label: 'Rank', width: '44px' },
          { label: 'Name', align: 'left' },
          { label: 'Score', width: '70px' },
        ]}
        data={[
          ...countries.map((country, i) => {
            const prevScore =
              i === 0
                ? 0
                : (Math.round(countries[i - 1].score * 100) / 100).toFixed(2)
            const score = (Math.round(country.score * 100) / 100).toFixed(2)

            return [
              <span
                key={`${country.slug}-rank`}
                className="block text-center text-sm font-bold"
              >
                {score === prevScore ? (
                  <span className="sr-only">{i + 1}</span>
                ) : (
                  i + 1
                )}
              </span>,
              <Link
                key={`${country.slug}-name`}
                href={`/countries/${country.slug}`}
                className="flex leading-tight after:absolute after:inset-0 after:content-['']"
              >
                <span aria-hidden className="mr-2">
                  {country.icon}
                </span>
                <span>{country.title}</span>
              </Link>,
              <span
                key={`${country.slug}-score`}
                className="block text-center text-sm font-bold"
              >
                {score}
              </span>,
            ]
          }),
        ]}
      />
    </div>
  )
}
