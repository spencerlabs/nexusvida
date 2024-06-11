import { Country } from './country'

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
