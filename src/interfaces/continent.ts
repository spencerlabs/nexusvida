import { Country } from './country'

export interface Continent {
  title: string
  slug: string
  content: string
  countries?: (Omit<Country, 'content'> & { score?: string; ranking: number })[]
}
