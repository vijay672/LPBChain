export function secondsToDhms(totalSeconds: number) {
  const d = Math.floor(totalSeconds / (3600 * 24))
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)

  return { days: d, hours: h, minutes: m, seconds: s }
}

