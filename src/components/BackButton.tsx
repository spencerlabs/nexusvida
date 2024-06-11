'use client'

import { useRouter, usePathname } from 'next/navigation'
import { TbArrowNarrowLeft } from 'react-icons/tb'

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/') return <div aria-hidden />

  return (
    <button onClick={router.back} className="px-2 -ml-2 justify-self-start">
      <TbArrowNarrowLeft aria-hidden className="h-6 w-6" />
    </button>
  )
}
