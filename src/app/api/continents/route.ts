import { getAllContinents } from '@/lib/api'

export async function GET() {
  const data = getAllContinents()

  return Response.json(data)
}
