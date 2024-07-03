'use client'

import { useRouter, usePathname } from 'next/navigation'

import { TbArrowNarrowLeft } from 'react-icons/tb'

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/') return <div aria-hidden />

  return (
    <button onClick={router.back} className="-ml-2 justify-self-start px-2">
      <TbArrowNarrowLeft aria-hidden className="h-6 w-6" />
    </button>
  )
}
