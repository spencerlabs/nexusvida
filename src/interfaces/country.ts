export interface Country {
  title: string
  slug: string
  content: string
  icon: string
  continent: string | string[]
  data: Record<string, number>
}
