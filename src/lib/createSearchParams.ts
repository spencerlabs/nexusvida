export const createSearchParams = (searchParams: {
  [key: string]: string | string[] | undefined
}): URLSearchParams => {
  if (!searchParams) return new URLSearchParams()

  const newParams: string[][] = []

  for (let i = 0; i < Object.keys(searchParams).length; i++) {
    const key = Object.keys(searchParams)[i]
    const val = searchParams[key]
    if (!val) continue

    if (typeof val === 'string') {
      newParams.push([key, val])
    } else {
      val.forEach((v) => newParams.push([key, v]))
    }
  }

  return new URLSearchParams(newParams)
}
