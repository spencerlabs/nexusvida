import type { Metadata } from 'next'
import { Work_Sans } from 'next/font/google'
import Link from 'next/link'
import { TbArrowNarrowRight, TbMenu } from 'react-icons/tb'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import BackButton from '@/components/BackButton'
import { getAllDatasets } from '@/lib/api'

import './globals.css'

const font = Work_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | NexusVida',
    default: 'NexusVida | Finding the best country through external data',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const datasets = getAllDatasets()

  const recentlyAdded = datasets.filter(
    (dataset) =>
      (new Date().getTime() - new Date(dataset.added).getTime()) /
        1000 /
        60 /
        60 /
        24 <
      60,
  )

  const recentlyUpdated = datasets.filter(
    (dataset) =>
      (new Date().getTime() - new Date(dataset.updated).getTime()) /
        1000 /
        60 /
        60 /
        24 <
      60,
  )

  const menuItems = [
    { href: '/countries', label: 'Countries' },
    { href: '/continents', label: 'Continents' },
    { href: '/datasets', label: 'Datasets' },
  ]

  return (
    <html lang="en">
      <body
        className={`${font.className} flex min-h-screen w-full flex-col bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50`}
      >
        {(recentlyAdded || recentlyUpdated) && (
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
          <BackButton />

          <Link href="/" className="flex items-center px-2 text-2xl">
            Nexus<span className="font-bold">Vida</span>
          </Link>

          <Menu>
            <MenuButton className="-mr-2 justify-self-end px-2">
              <TbMenu aria-hidden className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </MenuButton>
            <MenuItems
              anchor="bottom end"
              className="z-50 flex flex-col rounded-b-sm border border-t-0 bg-white pb-2 pt-1 text-right font-semibold uppercase dark:bg-stone-950"
            >
              {menuItems.map((item) => (
                <MenuItem key={item.label}>
                  <Link href={item.href} className="px-3 py-2">
                    {item.label}
                  </Link>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
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
