import { getDatasetBySlug } from '@/lib/api'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const data = getDatasetBySlug(params.slug)

  return Response.json(data)
}
