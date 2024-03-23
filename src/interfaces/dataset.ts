import { Country } from './country'

export interface Dataset {
  title: string
  slug: string
  content: string
  source: string
  year: number
  url: string
  countries?: Country[]
}
