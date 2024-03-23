import Link from 'next/link'

import { getAllCountries } from '@/app/api/countries/route'

export default async function Home() {
  const countries = getAllCountries()
    .map((c) => {
      const dataArr = Object.values(c.data)
      const score = dataArr.reduce((sum, a) => sum + a, 0) / dataArr.length

      return { ...c, score }
    })
    .sort((a, b) => (a.score < b.score ? -1 : 1))

  return (
    <>
      <h1 className="mb-8 text-center">NexusVida Rankings</h1>

      <div className="mx-auto w-full max-w-md">
        <table className="w-full select-none">
          <thead>
            <tr className="grid grid-cols-[44px_1fr_44px] gap-2 border-b-2 border-stone-400 px-2 py-2 text-xs font-bold uppercase dark:border-stone-600">
              <th>Rank</th>
              <th className="text-left">Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-400 dark:divide-stone-600">
            {countries.map((country, i) => (
              <tr
                key={country.slug}
                className="relative grid grid-cols-[44px_1fr_44px] items-center gap-2 px-2 py-2 text-lg transition-colors hover:bg-white dark:hover:bg-stone-950"
              >
                <td className="text-center text-sm font-bold">{i + 1}</td>
                <td className="">
                  <Link
                    href={`/countries/${country.slug}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    <span aria-hidden className="mr-2">
                      {country.icon}
                    </span>
                    <span>{country.title}</span>
                  </Link>
                </td>
                <td className="text-center text-sm font-bold">
                  {(Math.round(country.score * 100) / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
