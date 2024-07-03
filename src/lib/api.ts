import fs from 'fs'
import { join } from 'path'

import matter from 'gray-matter'

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

  const rankings = getNexusVidaRankings()

  const countries = getAllCountries()
    .filter((c) => {
      if (!c.continent) return false

      if (typeof c.continent === 'string') {
        return c.continent === continent.slug
      } else {
        return c.continent.includes(continent.slug)
      }
    })
    .map((c) => ({
      ...c,
      ranking: rankings.find((r) => r.slug === c.slug)?.ranking,
      score: rankings.find((r) => r.slug === c.slug)?.score,
    }))
    .sort((a, b) => (a?.ranking || 300) - (b?.ranking || 300))

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

export function calculateScore(values: number[]) {
  const rawScore = values.reduce((sum, a) => sum + a, 0) / values.length

  return (Math.round(rawScore * 100) / 100).toFixed(2)
}

export function getNexusVidaRankings() {
  const datasets = getAllDatasets()

  const countries = getAllCountries()
    .filter((c) => {
      // Filter out countries that don't have all datasets

      for (const data in c.data) {
        if (!c.data[data]) return false
      }

      return true
    })
    .map((c) => {
      // Adjust data for exclusions in the datasets

      const dataOptions = Object.keys(c.data)

      const updatedData: Record<string, number> = {}

      dataOptions.forEach((opt) => {
        const startingValue = c.data[opt]

        const dataset = datasets.find((d) => d.slug === opt)!

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
    .map((c) => {
      // Create the score and add it to the dataset
      return { ...c, score: calculateScore(Object.values(c.data)) }
    })
    .sort((a, b) => (Number(a.score) < Number(b.score) ? -1 : 1))
    .reduce(
      (prev, current, i) => {
        // Add ranking to dataset
        let ranking = i + 1

        if (i > 0 && current.score === prev[prev.length - 1].score) {
          ranking = prev[prev.length - 1].ranking
        }

        return [
          ...prev,
          {
            ...current,
            ranking,
          },
        ]
      },
      [] as (Omit<Country, 'content'> & { score?: string; ranking: number })[],
    )
    .map((c) => {
      const { data, ...rest } = c

      return rest
    })

  return countries
}
