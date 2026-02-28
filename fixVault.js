const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const TOKEN_ADDR = "0x923eAaCDD97d72c15F65682fCeC0b9204D155d39";
    const OLD_VAULT = "0x5e086504c6623109dD518E4515F2062071A2DcFa";
    const NEW_VAULT = "0x7Bc4be3260C38AB4A11E2Bc24a6Ee508c32bDAB3";

    console.log("Deployer:", deployer.address);
    const token = await hre.ethers.getContractAt("AIUToken", TOKEN_ADDR);

    const prevDeployerBal = await token.balanceOf(deployer.address);
    console.log("Deployer AIUT start:", hre.ethers.formatUnits(prevDeployerBal, 18));

    const oldVaultBal = await token.balanceOf(OLD_VAULT);
    console.log("Old Vault AIUT:", hre.ethers.formatUnits(oldVaultBal, 18));

    if (oldVaultBal > 0n) {
        console.log("Trying to release from old vault...");
        const oldVaultContract = await hre.ethers.getContractAt([
            "function release(address token) public",
            "function release() public"
        ], OLD_VAULT);

        try {
            const tx = await oldVaultContract.release(TOKEN_ADDR);
            await tx.wait();
            console.log("Released from old vault!");
        } catch (e) {
            console.log("Release(token) failed:", e.reason || e.message);
            // Wait! If it's just an old token or missing release(token)?
        }
    }

    const deployerBalAfterLog = await token.balanceOf(deployer.address);
    console.log("Deployer AIUT after recovery:", hre.ethers.formatUnits(deployerBalAfterLog, 18));

    // Now, if deployer has >= 500,000 AIUT, transfer to NEW_VAULT
    const newVaultBal = await token.balanceOf(NEW_VAULT);
    console.log("New Vault AIUT start:", hre.ethers.formatUnits(newVaultBal, 18));

    const requiredTokens = hre.ethers.parseUnits("500000", 18);
    if (deployerBalAfterLog >= requiredTokens && newVaultBal < requiredTokens) {
        console.log("Transferring 500,000 AIUT to NEW_VAULT...");
        const tx2 = await token.transfer(NEW_VAULT, requiredTokens);
        await tx2.wait();
        console.log("Transferred!");
    } else if (newVaultBal >= requiredTokens) {
        console.log("NEW_VAULT already has the tokens.");
    } else {
        console.log("Deployer doesn't have enough tokens. Current deployer balance: " + hre.ethers.formatUnits(deployerBalAfterLog, 18));
    }
}

main().catch(console.error);
