process.env.HARDHAT_DISABLE_TELEMETRY = "true";
process.env.HARDHAT_TELEMETRY_DISABLE = "1";
process.env.HARDHAT_IGNITION_TELEMETRY_DISABLE = "1";
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  sourcify: {
    enabled: true,
  },
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
