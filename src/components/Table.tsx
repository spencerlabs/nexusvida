interface TableProps extends React.ComponentPropsWithoutRef<'div'> {
  cols: {
    align?: 'left' | 'center' | 'right'
    label: string
    width?: string
  }[]
  data: React.ReactNode[][]
}

const Table = ({ cols, data, ...props }: TableProps) => {
  const gridTemplateColumns = cols.map((c) => c.width || '1fr').join(' ')

  return (
    <div {...props} role="table" className="w-full select-none">
      <div role="rowgroup" className="sticky top-12 z-10">
        <div
          role="row"
          className="grid gap-2 border-b-2 border-stone-400 bg-stone-100 p-2 text-xs font-bold uppercase dark:border-stone-600 dark:bg-stone-900"
          style={{ gridTemplateColumns }}
        >
          {cols.map((col) => (
            <span
              key={col.label}
              role="columnheader"
              style={{
                textAlign: col.align || 'center',
                width: col.width || undefined,
              }}
            >
              {col.label}
            </span>
          ))}
        </div>
      </div>
      <div
        role="rowgroup"
        className="divide-y divide-stone-400 dark:divide-stone-600"
      >
        {data?.map((item, i) => (
          <div
            key={i}
            role="row"
            className="relative grid gap-2 p-2 text-lg transition-colors hover:bg-white dark:hover:bg-stone-950"
            style={{ gridTemplateColumns }}
          >
            {item.map((cell, j) => (
              <span
                key={`${i}-${j}`}
                role="cell"
                style={{ textAlign: cols[j].align || 'center' }}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Table
