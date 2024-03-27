import { getNexusVidaRankings } from '@/lib/api'

export async function GET() {
  const data = getNexusVidaRankings()

  return Response.json(data)
}
