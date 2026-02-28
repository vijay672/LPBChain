const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    const AIUToken = await ethers.getContractFactory("AIUToken");
    const aiuToken = await AIUToken.deploy();
    await aiuToken.waitForDeployment();
    const aiuAddress = await aiuToken.getAddress();

    let multisigAddress = process.env.MULTISIG_ADDRESS;
    if (!multisigAddress) multisigAddress = deployer.address;
    multisigAddress = String(multisigAddress).trim().replace("0xYourNewAddressHere", "").trim();

    const latestBlock = await ethers.provider.getBlock("latest");
    const startTimestamp = latestBlock.timestamp;
    const durationSeconds = 30 * 24 * 60 * 60 * 10;

    const YuvaVault = await ethers.getContractFactory("YuvaVault");
    const yuvaVault = await YuvaVault.deploy(deployer.address, multisigAddress, startTimestamp, durationSeconds);
    await yuvaVault.waitForDeployment();
    const yuvaVaultAddress = await yuvaVault.getAddress();

    const tx = await aiuToken.transfer(yuvaVaultAddress, ethers.parseUnits("500000", 18));
    await tx.wait();

    fs.writeFileSync("deployed_addrs.json", JSON.stringify({ Token: aiuAddress, Vault: yuvaVaultAddress }));
}
main().catch(console.error);
