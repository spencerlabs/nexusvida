import { calculateScore } from '@/lib/calculateScore'
import { prisma } from '@/lib/prisma'

import type { Prisma } from '@prisma/client'

// RANKINGS

export const getCountryRankings = async (searchParams: URLSearchParams) => {
  const queries: Prisma.CountryWhereInput = {}

  const datasets = searchParams.getAll('dataset')
  const orderBy = searchParams.get('orderBy')
  const order = searchParams.get('order')
  const query = searchParams.get('query')

  const sort = orderBy ? { orderBy, order } : undefined

  const datasetCount = await prisma.dataset.count()

  if (searchParams && searchParams?.getAll('continent').length > 0) {
    queries.continents = {
      some: {
        id: {
          in: searchParams.getAll('continent'),
        },
      },
    }
  }

  const prismaCountries = await prisma.country.findMany({
    where: { ...queries },
    include: {
      datasets: {
        include: {
          dataset: {
            include: {
              excludes: true,
            },
          },
        },
      },
    },
  })

  const countries = prismaCountries
    .map((c) => {
      // Adjust data for exclusions in the datasets

      c.datasets.forEach((dataset, i) => {
        if (dataset.dataset.excludes.length === 0) return

        const reduction = dataset.dataset.excludes.reduce((prev, current) => {
          if (current.value > dataset.value) return prev

          return prev + 1
        }, 0)

        c.datasets[i].value = dataset.value - reduction
      })

      return c
    })
    // add ranking data to each remaining country
    .map((c) => {
      if (datasets.length > 0) {
        const values: number[] = []

        for (let i = 0; i < datasets.length; i++) {
          const dataset = datasets[i]

          const value = c.datasets.find((d) => d.dataset.id === dataset)?.value

          if (!value) continue

          values.push(value)
        }

        return {
          ...c,
          score:
            values.length === datasets.length
              ? calculateScore(values)
              : undefined,
        }
      }

      return {
        ...c,
        score:
          c.datasets.length === datasetCount
            ? calculateScore(c.datasets.map((d) => d.value))
            : undefined,
      }
    })
    // Initial sort
    .sort((a, b) => Number(a.score || 300) - Number(b.score || 300))
    // Add ranking to dataset
    .reduce(
      (prev, current, i) => {
        if (
          !current.score ||
          (prev[prev.length - 1] && !prev[prev.length - 1].ranking)
        ) {
          return [
            ...prev,
            {
              ...current,
              ranking: undefined,
            },
          ]
        }

        let ranking = i + 1

        if (i > 0 && current.score === prev[prev.length - 1].score) {
          ranking = prev[prev.length - 1].ranking!
        }

        return [
          ...prev,
          {
            ...current,
            ranking,
          },
        ]
      },
      [] as ((typeof prismaCountries)[number] & {
        score?: string
        ranking?: number
      })[],
    )
    // sort by provided sort or default to score
    .sort((a, b) => {
      if (!sort || !sort.orderBy) {
        return Number(a.score || 300) - Number(b.score || 300)
      }

      const aVal =
        a[
          sort.orderBy as keyof ((typeof prismaCountries)[number] & {
            score?: string
            ranking?: number
          })
        ]
      const bVal =
        b[
          sort.orderBy as keyof ((typeof prismaCountries)[number] & {
            score?: string
            ranking?: number
          })
        ]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.order === 'desc'
          ? aVal > bVal
            ? -1
            : 1
          : aVal < bVal
            ? -1
            : 1
      }

      return sort.order === 'desc'
        ? Number(aVal) > Number(bVal)
          ? -1
          : 1
        : Number(aVal) < Number(bVal)
          ? -1
          : 1
    })
    // run query filter last to maintain ranking data
    .filter((c) => {
      if (query && !c.name.toLowerCase().includes(query.toLowerCase())) {
        return false
      }

      return true
    })

  return countries
}
