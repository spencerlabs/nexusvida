import { getAllCountries } from '@/lib/api'

export async function GET() {
  const data = getAllCountries()

  return Response.json(data)
}
