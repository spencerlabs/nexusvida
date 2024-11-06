import { permanentRedirect } from 'next/navigation'

export default async function ContinentPage(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  permanentRedirect(`/?continent=${params.slug}`)
}
