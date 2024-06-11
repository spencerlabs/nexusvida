import Link from 'next/link'

interface ArticleItemProps {
  children?: React.ReactNode
  href: string
}

const ArticleItem = ({ children, href }: ArticleItemProps) => {
  return (
    <article>
      <h2 className="text-lg font-normal">
        <Link
          href={href}
          className="group relative flex items-center rounded-xl bg-white px-3 py-1 transition-colors dark:bg-stone-950"
        >
          {children}
        </Link>
      </h2>
    </article>
  )
}

export default ArticleItem
