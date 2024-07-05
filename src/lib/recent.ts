export const recent = (date: Date) => {
  return (new Date().getTime() - date.getTime()) / 1000 / 60 / 60 / 24 < 60
}
