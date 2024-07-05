export function calculateScore(values: number[]) {
  const rawScore = values.reduce((sum, a) => sum + a, 0) / values.length

  return (Math.round(rawScore * 100) / 100).toFixed(2)
}
