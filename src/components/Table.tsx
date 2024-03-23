interface TableProps {
  cols: {
    align?: 'left' | 'center' | 'right'
    label: string
    width?: string
  }[]
  data: React.ReactNode[][]
}

const Table = ({ cols, data }: TableProps) => {
  return (
    <table className="w-full select-none">
      <thead>
        <tr className="border-b-2 border-stone-400 text-xs font-bold uppercase dark:border-stone-600">
          {cols.map((col) => (
            <th
              key={col.label}
              className="sticky top-12 z-10 bg-stone-100 p-2 dark:bg-stone-900"
              style={{
                textAlign: col.align || undefined,
                width: col.width || undefined,
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-400 dark:divide-stone-600">
        {data?.map((item, i) => (
          <tr
            key={i}
            className="relative text-lg transition-colors hover:bg-white dark:hover:bg-stone-950"
          >
            {item.map((cell, j) => (
              <td key={`${i}-${j}`} className="p-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
