import { Work_Sans } from 'next/font/google'
import Link from 'next/link'

import { TbArrowNarrowRight } from 'react-icons/tb'

import { prisma } from '@/lib/prisma'
import { recent } from '@/lib/recent'

import type { Metadata } from 'next'

import './globals.css'

const font = Work_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | NexusVida',
    default: 'NexusVida | Finding the best country through external data',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const datasets = await prisma.dataset.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const recentlyAdded = datasets.filter((dataset) => recent(dataset.created_at))
  const recentlyUpdated = datasets.filter((dataset) =>
    recent(dataset.updated_at),
  )

  return (
    <html lang="en">
      <body
        className={`${font.className} flex min-h-screen w-full flex-col bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50`}
      >
        {(recentlyAdded.length > 0 || recentlyUpdated.length > 0) && (
          <Link
            href="/datasets"
            className={`${recentlyAdded ? 'bg-sky-300 dark:bg-sky-700' : 'bg-amber-300 dark:bg-amber-700'} flex items-center justify-center px-wrap py-1 text-sm font-semibold hover:bg-opacity-80 hover:text-stone-950 hover:dark:text-stone-50`}
          >
            {recentlyAdded
              ? 'New datasets recently added'
              : 'Datasets recently updated'}
            <TbArrowNarrowRight aria-hidden className="ml-1 h-4 w-4" />
          </Link>
        )}
        <header className="sticky top-0 z-30 grid h-12 grid-cols-[1fr_max-content_1fr] items-stretch border-b bg-white px-wrap uppercase dark:bg-stone-950">
          <nav className="flex h-full items-stretch text-sm font-bold">
            <Link href="/countries" className="flex items-center">
              Countries
            </Link>
          </nav>

          <Link href="/" className="flex items-center px-2 text-2xl">
            Nexus<span className="font-bold">Vida</span>
          </Link>

          <nav className="flex h-full items-stretch justify-self-end text-sm font-bold">
            <Link href="/datasets" className="flex items-center">
              Datasets
            </Link>
          </nav>
        </header>

        <main className="mb-8 flex-1 border-b bg-stone-100 px-wrap py-12 dark:bg-stone-900">
          {children}
        </main>

        <footer className="fixed bottom-0 -z-10 flex h-8 w-full items-center justify-center bg-white px-wrap text-xs dark:bg-stone-950">
          Copyright &copy; {new Date().getFullYear()} Spencer Labs
        </footer>
      </body>
    </html>
  )
}
