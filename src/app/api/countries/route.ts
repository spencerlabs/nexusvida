import { Country } from '@/interfaces/country'
import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'

const countriesDirectory = join(process.cwd(), '_content/countries')

export function getCountrySlugs() {
  return fs.readdirSync(countriesDirectory)
}

export function getCountryBySlug<C extends boolean = false>(
  slug: string,
  hideContent?: C,
): C extends true ? Omit<Country, 'content'> : Country
export function getCountryBySlug(
  slug: string,
  hideContent?: boolean,
): Omit<Country, 'content'> | Country {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(countriesDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  if (hideContent) {
    return { ...data, slug: realSlug } as Country
  }

  return { ...data, slug: realSlug, content } as Country
}

export function getAllCountries() {
  const slugs = getCountrySlugs()
  const countries = slugs
    .map((slug) => getCountryBySlug(slug, true))
    // sort countries by date in descending order
    .sort((country1, country2) => (country1.title < country2.title ? -1 : 1))
  return countries
}

export async function GET() {
  const data = getAllCountries()

  return Response.json(data)
}
