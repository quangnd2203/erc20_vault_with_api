import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config } from "dotenv";

config();

const hardHatConfig: HardhatUserConfig = {
  solidity: "0.8.23",
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: 'BNB',
    gasPrice: 3,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY as string,
  },
  networks: {
    hardhat: {
      gas: 30000000,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [
        process.env.OWNER_PRIVATE_KEY as string
      ]
    },
    bscMainnet: {
      url: "https://bsc-dataseed.bnbchain.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [
        process.env.OWNER_PRIVATE_KEY as string
      ]
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY as string
  }
};

export default hardHatConfig;
