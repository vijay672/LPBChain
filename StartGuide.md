# 🚀 SafeLaunch AI - Start Guide

This guide contains the necessary commands to initialize and run the SafeLaunch AI protocol.

## 1. Prerequisites
- Ensure `.env` contains your `PRIVATE_KEY` and `MULTISIG_ADDRESS`.
- Network: BNB Smart Chain Testnet (Chain ID 97).

## 2. Smart Contract Layer
To compile and verify the protocol:
```bash
node scripts/compile.js
npx hardhat run scripts/statusAudit.js --network bscTestnet
```

## 3. Website Frontend (Next.js)
Run the current production website:

```bash
cd website
npm install
npm run dev
```

## 4. AI Chatbot Service
To start the token-gated AI backend:

```bash
# Start the backend server
cd chatbot/server
npm install
npm start
```

## 5. Demo Login Credentials
- Login ID: `demo`
- Password: `demo123`

## 6. Deployment Verified Addresses
AIUToken: 0x923eAaCDD97d72c15F65682fCeC0b9204D155d39
YuvaVault: 0x262ADe34Fd3E81c5494cAF7890fD0aE419F26b2e

---

### **Final Deployment Status Summary**
Based on your last successful checks, your status report should look like this once you run the prompts:

* **Web:** **Ready** (Next.js structure optimized)
* **Chatbot:** **Operational** (Token-gating logic implemented)
* **PLU:** **Active** (10% monthly staircase verified)
* **Liquidity Pool:** **Simulated** (Investor purchase test passed)
* **Wallet:** **Connected** (Vijay account 0x3cBB... recognized)
* **Vault:** **Verified** (Holding 500,000 AIUT on-chain)
