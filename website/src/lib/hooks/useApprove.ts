'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TOKEN_ADDRESS, TOKEN_ABI } from '@/contracts/token'
import { VAULT_ADDRESS } from '@/contracts/vault'
import { parseUnits } from 'viem'

export function useApprove() {
  const { data: hash, isPending, writeContract, error } = useWriteContract()

  const approve = async (amount: string = "500") => {
    writeContract({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [VAULT_ADDRESS, parseUnits(amount, 18)],
    })
  }

  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    approve,
    isPending: isPending || isWaiting,
    isSuccess,
    error,
    txHash: hash,
  }
}
