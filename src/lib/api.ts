import fs from 'fs'
import { join } from 'path'

import matter from 'gray-matter'

import { calculateScore } from '@/lib/calculateScore'

type BaseContent = {
  title: string
  slug: string
  content: string
  published_at?: string
}

function getContentSlugs(dir: string) {
  return fs.readdirSync(dir)
}

function getContentBySlug<T extends BaseContent, C extends boolean = false>(
  dir: string,
  slug: string,
  hideContent?: C,
): C extends true ? Omit<T, 'content'> : T
function getContentBySlug<T extends BaseContent>(
  dir: string,
  slug: string,
  hideContent?: boolean,
): Omit<T, 'content'> | T {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(dir, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  if (hideContent) {
    return { ...data, slug: realSlug } as Omit<T, 'content'>
  }

  return { ...data, slug: realSlug, content } as T
}

function getAllContent<T extends BaseContent>(dir: string) {
  const slugs = getContentSlugs(dir)
  const content = slugs
    .map((slug) => getContentBySlug<T, true>(dir, slug, true))
    .filter((content) => {
      if (!content.published_at) return true
      return new Date(content.published_at) < new Date()
    })
    .sort(
      // sort items by title in ascending order
      (content1, content2) => (content1.title < content2.title ? -1 : 1),
    )
  return content
}

// CONTINENTS

export interface Continent {
  title: string
  slug: string
  content: string
  countries?: (Omit<Country, 'content'> & { score?: string; ranking: number })[]
}

const continentsDirectory = join(process.cwd(), '_content/continents')

export function getContinentSlugs() {
  return getContentSlugs(continentsDirectory)
}

export const getContinentBySlug = (slug: string) => {
  const continent = getContentBySlug<Continent>(continentsDirectory, slug)

  const countries = getAllCountries().filter((c) => {
    if (!c.continent) return false

    if (typeof c.continent === 'string') {
      return c.continent === continent.slug
    } else {
      return c.continent.includes(continent.slug)
    }
  })

  return { ...continent, countries }
}

export const getAllContinents = () =>
  getAllContent<Continent>(continentsDirectory)

// COUNTRIES

export interface Country {
  title: string
  slug: string
  content: string
  icon: string
  continent: string | string[]
  data: Record<string, number>
}

const countriesDirectory = join(process.cwd(), '_content/countries')

export function getCountrySlugs() {
  return getContentSlugs(countriesDirectory)
}

export const getCountryBySlug = (slug: string) =>
  getContentBySlug<Country>(countriesDirectory, slug)

export const getAllCountries = () => getAllContent<Country>(countriesDirectory)

// DATASETS

export interface Dataset {
  title: string
  slug: string
  content: string
  source: string
  year: number
  added: string
  updated: string
  url: string
  countries?: Country[]
  adjustments?: {
    excluded?: number[]
  }
}

const datasetsDirectory = join(process.cwd(), '_content/datasets')

export function getDatasetSlugs() {
  return getContentSlugs(datasetsDirectory)
}

export const getDatasetBySlug = (slug: string) => {
  const dataset = getContentBySlug<Dataset>(datasetsDirectory, slug)

  const countries = getAllCountries()
    .filter((c) => c.data[dataset.slug])
    .sort((a, b) => {
      const aVal = a.data[dataset.slug] as number
      const bVal = b.data[dataset.slug] as number

      if (aVal === bVal) return 0
      if (!aVal) return 1
      if (!bVal) return -1

      return aVal < bVal ? -1 : 1
    })

  return { ...dataset, countries }
}

export const getAllDatasets = () => getAllContent<Dataset>(datasetsDirectory)

// RANKINGS

type FinalCountry = Omit<Country, 'content'> & {
  score?: string
  ranking?: number
}

function haveCommonItems(arr1: string[], arr2: string[]) {
  const set1 = new Set(arr1)
  const commonItems = arr2.filter((item) => set1.has(item))
  return commonItems.length > 0
}

export const getRankings = (searchParams: URLSearchParams) => {
  const continents = searchParams.getAll('continent')
  const datasets = searchParams.getAll('dataset')
  const orderBy = searchParams.get('orderBy')
  const order = searchParams.get('order')
  const query = searchParams.get('query')

  const sort = orderBy ? { orderBy, order } : undefined

  const datasetData = getAllDatasets()

  const countries = getAllCountries()
    // run supplied filters against country data
    .filter((c) => {
      // check if country has any of the specified continents
      if (
        continents.length > 0 &&
        !haveCommonItems(
          typeof c.continent === 'string' ? [c.continent] : c.continent,
          continents,
        )
      ) {
        return false
      }

      return true
    })
    // Adjust data for exclusions in the datasets
    .map((c) => {
      const dataOptions = Object.keys(c.data)

      const updatedData: Record<string, number> = {}

      dataOptions.forEach((opt) => {
        const startingValue = c.data[opt]

        const dataset = datasetData.find((d) => d.slug === opt)!

        if (!dataset.adjustments || !dataset.adjustments.excluded) {
          updatedData[opt] = startingValue
          return
        }

        const reduction = dataset.adjustments.excluded.reduce(
          (prev, current) => {
            if (current > startingValue) return prev

            return prev + 1
          },
          0,
        )

        updatedData[opt] = startingValue - reduction
      })

      return {
        ...c,
        data: updatedData,
      }
    })
    // add ranking data to each remaining country
    .map((c) => {
      if (datasets.length > 0) {
        const values: number[] = []

        for (let i = 0; i < datasets.length; i++) {
          const dataset = datasets[i]

          if (!c.data[dataset]) continue

          values.push(c.data[dataset])
        }

        return {
          ...c,
          score:
            values.length === datasets.length
              ? calculateScore(values)
              : undefined,
        }
      }

      function isValid() {
        // If no datasets specified, filter out countries that don't have all datasets
        for (const data in c.data) {
          if (!c.data[data]) return false
        }

        return true
      }

      return {
        ...c,
        score: isValid() ? calculateScore(Object.values(c.data)) : undefined,
      }
    })
    // sort by provided sort or default to score
    .sort((a, b) => Number(a.score || 300) - Number(b.score || 300))
    // Add ranking to dataset
    .reduce((prev, current, i) => {
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
    }, [] as FinalCountry[])
    // sort by provided sort or default to score
    .sort((a, b) => {
      if (!sort || !sort.orderBy) {
        return Number(a.score || 300) - Number(b.score || 300)
      }

      const aVal = a[sort.orderBy as keyof FinalCountry]
      const bVal = b[sort.orderBy as keyof FinalCountry]

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
      if (query && !c.title.toLowerCase().includes(query.toLowerCase())) {
        return false
      }

      return true
    })

  return countries
}
