import type { Metadata } from 'next'
import { Work_Sans } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const font = Work_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NexusVida | Finding the best country through external data',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} flex min-h-screen w-full flex-col bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50`}
      >
        <header className="sticky top-0 z-30 grid h-12 grid-cols-[1fr_max-content_1fr] items-stretch bg-white px-wrap uppercase dark:bg-stone-950">
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

        <main className="mb-8 flex-1 bg-stone-100 px-wrap py-12 dark:bg-stone-900">
          {children}
        </main>

        <footer className="fixed bottom-0 -z-10 flex h-8 w-full items-center justify-center bg-white px-wrap text-xs dark:bg-stone-950">
          Copyright &copy; {new Date().getFullYear()} Spencer Labs
        </footer>
      </body>
    </html>
  )
}
