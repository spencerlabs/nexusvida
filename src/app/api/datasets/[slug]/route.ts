import { getDatasetBySlug } from '../route'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const data = getDatasetBySlug(params.slug)

  return Response.json(data)
}
