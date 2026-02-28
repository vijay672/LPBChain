import { useAccount, useReadContract } from 'wagmi'
import { VAULT_ADDRESS, VAULT_ABI, VESTING_START, VESTING_DURATION } from '@/contracts/vault'
import { TOKEN_ADDRESS } from '@/contracts/token'

function toBigInt(value: unknown): bigint {
  if (typeof value === 'bigint') return value
  if (typeof value === 'number' || typeof value === 'string') return BigInt(value)
  return 0n
}

export function useVaultData() {
  const { address } = useAccount()

  const { data: releasable, isLoading: loadingReleasable, refetch: refetchReleasable, error: releasableError } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'releasable',
    args: [TOKEN_ADDRESS],
    query: { 
      enabled: !!address,
      refetchInterval: 5000,
    },
  })

  const { data: released, isLoading: loadingReleased, error: releasedError } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'released',
    args: [TOKEN_ADDRESS],
    query: { 
      enabled: !!address,
      refetchInterval: 5000,
    },
  })

  const { data: startTime, isLoading: loadingStart } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'start',
    query: { enabled: !!address },
  })

  const { data: duration, isLoading: loadingDuration } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'duration',
    query: { enabled: !!address },
  })

  if (releasableError) console.error('useVaultData releasable error:', releasableError)
  if (releasedError) console.error('useVaultData released error:', releasedError)

  const isLoading = loadingReleasable || loadingReleased || loadingStart || loadingDuration

  // Calculate total locked as released + releasable for simplicity if not directly available
  const totalLocked = toBigInt(releasable) + toBigInt(released)

  return {
    totalLocked,
    releasable: toBigInt(releasable),
    startTime: startTime ? Number(startTime) : VESTING_START,
    duration: duration ? Number(duration) : VESTING_DURATION,
    isLoading,
    refetchReleasable,
  }
}
