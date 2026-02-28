# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

safe-launch-ai is a BNB Chain launchpad platform combining Solidity smart contracts (token + vesting vaults) with an AI chatbot agent gated by on-chain token balance. It targets BNB Smart Chain Testnet (chain ID 97).

## Build and Development Commands

### Smart Contracts (root directory, Hardhat)

```
npx hardhat compile              # Compile all Solidity contracts
npx hardhat test                 # Run contract tests (Mocha + Chai)
npx hardhat test test/LaunchpadTest.js  # Run a single test file
npx hardhat run scripts/deploy.js --network bscTestnet  # Deploy to BNB Testnet
npx hardhat run scripts/statusAudit.js --network bscTestnet  # On-chain status audit
```

Solidity version: `0.8.20`. Hardhat config is `hardhat.config.js` (CommonJS, not TypeScript).

### Chatbot Server (`chatbot/server/`)

Express + Google Generative AI (Gemini). ESM module (`"type": "module"`).

```
npm start          # Runs on port 3001 by default
```

Requires `GEMINI_API_KEY` in `chatbot/server/.env`.

### Chatbot Frontend (`chatbot/app/`)

React app (Create React App). Proxies API calls to `http://localhost:3001`.

```
npm start          # Dev server (port 3000)
npm run build      # Production build
npm test           # Jest + React Testing Library
```

### Web Frontend (`web/plu-ai/`)

Next.js 16 + TypeScript + Tailwind CSS 4 + wagmi/viem for wallet integration.

```
npm run dev        # Next.js dev server
npm run build      # Production build
npm run lint       # ESLint
```

## Architecture

### Smart Contracts (`contracts/`)

- **AIUToken.sol** — ERC-20 "AI Utility Token" (AIUT). Fixed supply of 1M tokens minted to deployer. Uses OpenZeppelin `ERC20`. This token gates access to the AI chatbot.
- **VestingVault.sol** — Custom BNB vesting vault with staircase unlock (10% per 30-day period, 10 periods). Has `owner` (project beneficiary) and `emergencyMultisig` (3-of-4 sweep). Does NOT inherit OpenZeppelin.
- **YuvaVault.sol** — Extends OpenZeppelin's `VestingWallet` with the same staircase schedule override in `_vestingSchedule()` and an emergency sweep to multisig. This is the primary vault used in deployment.

The deploy script (`scripts/deploy.js`) deploys AIUToken, then YuvaVault (with deployer as beneficiary), then transfers 500K AIUT to the vault. It reads `MULTISIG_ADDRESS` from `.env`.

### Chatbot (`chatbot/`)

Two sub-projects with separate `node_modules`:
- **`chatbot/server/`** — Express API server calling Google Gemini. Token-gated: the `/api/chat` endpoint checks `tokenBalance` from the request body against a tier system (1/10/40/75+ tokens → varying verbosity). Includes model fallback chain and exponential backoff retry on 429s.
- **`chatbot/app/`** — React SPA connecting to MetaMask via ethers.js v5. Reads AIUT balance and vault releasable amount on-chain. Currently uses a local mock AI (`utils/mockAi.js`) instead of the live server for responses.

`scripts/BNB/server/index.js` is an identical copy of `chatbot/server/index.js`.

### Frontend ABIs (`frontend/src/`)

Contains JSON ABIs (`abis/AIUTokenABI.json`, `abis/VestingVaultABI.json`) and deployed contract addresses in `constants/contracts.js`. These addresses must stay in sync with actual deployments.

## Environment Variables

Root `.env`:
- `PRIVATE_KEY` — deployer wallet private key (for Hardhat deployments)
- `MULTISIG_ADDRESS` — emergency multisig address for vault constructors

`chatbot/server/.env`:
- `GEMINI_API_KEY` — Google Gemini API key
- `GEMINI_MODEL` (optional) — preferred model name prepended to fallback list
- `PORT` (optional) — server port, defaults to 3001

## Key Conventions

- Solidity contracts use OpenZeppelin v5.4 (`@openzeppelin/contracts`). The VestingVault is a standalone implementation while YuvaVault extends `VestingWallet`.
- The chatbot app uses ethers.js v5 (`ethers` in `chatbot/app/`) while the root Hardhat project uses ethers.js v6. Do not mix versions.
- The chatbot frontend currently falls back to mock AI responses (`utils/mockAi.js`). The backend server integration exists but the frontend calls `getMockAiResponse` instead of the API.
- Contract addresses in `frontend/src/constants/contracts.js` and `scripts/statusAudit.js` are hardcoded to specific BNB Testnet deployments and must be updated after redeployment.
- The token tier system in the chatbot server controls response verbosity — higher token balances get more detailed responses.
