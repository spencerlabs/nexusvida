import { getContinentBySlug } from '@/lib/api'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const data = getContinentBySlug(params.slug)

  return Response.json(data)
}
