'use client'

import { Suspense, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { TbFilter, TbFilterFilled } from 'react-icons/tb'

function FilterPopupInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)

  const hasFilters = () => {
    const tempParams = new URLSearchParams(searchParams.toString())

    tempParams.delete('query')
    tempParams.delete('orderBy')
    tempParams.delete('order')

    return Array.from(tempParams.keys()).length > 0
  }

  const Icon = hasFilters() ? TbFilterFilled : TbFilter

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={hasFilters() ? 'text-sky-600 dark:text-sky-400' : undefined}
      >
        <Icon aria-hidden className="h-5 w-5" />
        <span className="sr-only">Filters</span>
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 z-50 flex w-screen items-center justify-center bg-stone-100 bg-opacity-95 px-wrap py-12 dark:bg-stone-900 dark:bg-opacity-95">
          <DialogPanel className="w-full max-w-lg border bg-white p-4 dark:bg-stone-950">
            <DialogTitle className="mb-4">Filters</DialogTitle>
            <Description className="mb-4 text-sm opacity-75">
              Clear all filters for default NexusVida rankings
            </Description>
            <div className="space-y-2">{children}</div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default function FilterPopup({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
      <FilterPopupInner>{children}</FilterPopupInner>{' '}
    </Suspense>
  )
}
