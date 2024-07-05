export const recent = (date: string) => {
  return (
    (new Date().getTime() - new Date(date).getTime()) / 1000 / 60 / 60 / 24 < 60
  )
}
