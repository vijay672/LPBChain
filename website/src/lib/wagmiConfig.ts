import { createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { http } from 'viem'

export const config = createConfig({
  chains: [bscTestnet],
  ssr: true,
  connectors: [injected()],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
})
