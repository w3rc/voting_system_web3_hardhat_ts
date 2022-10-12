import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || './.env'
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) })

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const GOERLI_URL = `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY ?? ''

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY],
    },
  },
}

export default config
