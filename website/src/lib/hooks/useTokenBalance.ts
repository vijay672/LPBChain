import { useAccount, useReadContract } from 'wagmi'
import { TOKEN_ADDRESS, TOKEN_ABI } from '@/contracts/token'

function toBigInt(value: unknown): bigint {
  if (typeof value === 'bigint') return value
  if (typeof value === 'number' || typeof value === 'string') return BigInt(value)
  return 0n
}

export function useTokenBalance() {
  const { address } = useAccount()

  const { data: balance, isLoading, refetch, error } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  if (error) {
    console.error('useTokenBalance error:', error)
  }

  return {
    balance: toBigInt(balance),
    isLoading,
    refetch,
  }
}
