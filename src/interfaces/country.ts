interface CountryData extends Record<string, number> {
  gpi: number
  gdp: number
  hdi: number
}

export interface Country {
  title: string
  slug: string
  content: string
  icon: string
  data: CountryData
}
