import { permanentRedirect } from 'next/navigation'

export default function ContinentPage({
  params,
}: {
  params: { slug: string }
}) {
  permanentRedirect(`/?continent=${params.slug}`)
}
