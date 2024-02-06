require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.8.23",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
      blockConfirmations: 6,
      chainId: 80001,
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/",
      chainId: 534351,
      accounts: [process.env.PRIVATE_KEY],
    },
    baseGoerli: {
      url: "https://base-goerli.publicnode.com",
      chainId: 84531,
      accounts: [process.env.PRIVATE_KEY],
    },
    polyzkEVM: {
      url: "https://rpc.public.zkevm-test.net",
      chainId: 1442,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: "9P38ZVKJTEEGJ2W15G9CFCA37S5CH4XZHT",
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.dev/",
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
