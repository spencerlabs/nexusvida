import { getCountryBySlug } from '../route'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const data = getCountryBySlug(params.slug)

  return Response.json(data)
}
