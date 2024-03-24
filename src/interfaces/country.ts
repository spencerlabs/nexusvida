interface CountryData extends Record<string, number> {
  col: number
  gci: number
  gdp: number
  gpi: number
  hdi: number
  whr: number
}

export interface Country {
  title: string
  slug: string
  content: string
  icon: string
  data: CountryData
}
