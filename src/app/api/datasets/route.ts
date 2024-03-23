import { Dataset } from '@/interfaces/dataset'
import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'
import { getAllCountries } from '../countries/route'

const datasetsDirectory = join(process.cwd(), '_content/datasets')

export function getDatasetSlugs() {
  return fs.readdirSync(datasetsDirectory)
}

export function getDatasetBySlug<C extends boolean = false>(
  slug: string,
  hideContent?: C,
): C extends true ? Omit<Dataset, 'content'> : Dataset
export function getDatasetBySlug(
  slug: string,
  hideContent?: boolean,
): Omit<Dataset, 'content'> | Dataset {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(datasetsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  if (hideContent) {
    return { ...data, slug: realSlug } as Dataset
  }

  const countries = getAllCountries().sort((a, b) => {
    const aVal = a.data[realSlug] as number
    const bVal = b.data[realSlug] as number

    if (aVal === bVal) return 0
    if (!aVal) return 1
    if (!bVal) return -1

    return aVal < bVal ? -1 : 1
  })

  return { ...data, countries, slug: realSlug, content } as Dataset
}

export function getAllDatasets() {
  const slugs = getDatasetSlugs()
  const datasets = slugs
    .map((slug) => getDatasetBySlug(slug, true))
    // sort datasets by date in descending order
    .sort((dataset1, dataset2) => (dataset1.title < dataset2.title ? -1 : 1))
  return datasets
}

export async function GET() {
  const data = getAllDatasets()

  return Response.json(data)
}
