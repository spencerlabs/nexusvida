import { getAllDatasets } from '@/lib/api'

export async function GET() {
  const data = getAllDatasets()

  return Response.json(data)
}
