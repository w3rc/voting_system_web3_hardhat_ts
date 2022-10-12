import { ethers } from 'hardhat'

const main = async () => {
  const Ballot = await ethers.getContractFactory('Ballot')

  const ballot = await Ballot.deploy([
    ethers.utils.formatBytes32String('Alpha A'),
    ethers.utils.formatBytes32String('Beta B'),
    ethers.utils.formatBytes32String('Gamma C'),
    ethers.utils.formatBytes32String('Delta D'),
  ])
  await ballot.deployed()

  console.log(`Ballot has been deployed. Address -> ${ballot.address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
