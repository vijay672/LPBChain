const { ethers } = require("hardhat");
const AIUTokenAbi = require("./artifacts/contracts/AIUToken.sol/AIUToken.json").abi;
const YuvaVaultAbi = require("./artifacts/contracts/YuvaVault.sol/YuvaVault.json").abi;

async function main() {
    const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");

    const tokenAddress = "0x923eAaCDD97d72c15F65682fCeC0b9204D155d39";
    const vaultAddress = "0x262ADe34Fd3E81c5494cAF7890fD0aE419F26b2e";
    const testAddress = "0x3cBB787D4aaC34b750A4D0c717fC970f28c2d35d";

    const token = new ethers.Contract(tokenAddress, AIUTokenAbi, provider);
    const vault = new ethers.Contract(vaultAddress, YuvaVaultAbi, provider);

    console.log("=== Feature Execution Simulation ===");
    console.log(`Simulated Wallet: ${testAddress}`);

    const balance = await token.balanceOf(testAddress);
    console.log(`Simulate Token Gate: Balance of ${testAddress} is ${ethers.formatUnits(balance, 18)} AIUT`);

    if (balance > 0n) {
        console.log("-> Token Gate Check: PASSED (Access Granted to Chatbot)");
    } else {
        console.log("-> Token Gate Check: FAILED (No access)");
    }

    console.log("\nSimulate PLU Calculation:");
    try {
        const start = await vault.start();
        const duration = await vault.duration();
        const now = BigInt(Math.floor(Date.now() / 1000));
        const elapsed = now > start ? now - start : 0n;
        const PERIOD_SECONDS = 30n * 24n * 60n * 60n;
        const TOTAL_PERIODS = 10n;
        const periodsElapsed = elapsed > 0n ? (elapsed >= duration ? TOTAL_PERIODS : elapsed / PERIOD_SECONDS) : 0n;

        console.log(`Vault Start: ${start}, Duration: ${duration}`);
        console.log(`Current Time: ${now} -> Elapsed: ${elapsed}`);
        console.log(`Periods Elapsed: ${periodsElapsed}/10`);
        console.log(`Staircase step: ${periodsElapsed * 10n}% unlocked`);
    } catch (e) {
        console.log("PLU Calculation error:", e.message);
    }
}

main().catch(console.error);
