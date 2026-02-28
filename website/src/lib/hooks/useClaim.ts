import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { VAULT_ADDRESS, VAULT_ABI } from '@/contracts/vault'
import { TOKEN_ADDRESS } from '@/contracts/token'

export function useClaim() {
  const { data: hash, isPending, writeContract, error } = useWriteContract()

  const claim = () => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'release',
      args: [TOKEN_ADDRESS],
    })
  }

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    claim,
    isPending: isPending || isWaiting,
    isSuccess,
    error,
    txHash: hash,
  }
}
