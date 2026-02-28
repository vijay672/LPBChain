import { formatUnits } from 'viem'

export function formatToken(amount: bigint, decimals = 18) {
  const formatted = formatUnits(amount, decimals)
  return Number(formatted).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

