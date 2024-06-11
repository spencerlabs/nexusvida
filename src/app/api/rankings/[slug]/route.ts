import { getNexusVidaRankings } from '@/lib/api'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const data = getNexusVidaRankings()

  const country = data.find((c) => c.slug === params.slug)

  return Response.json(country)
}
