import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Ballot', () => {
  const candidates = [
    ethers.utils.formatBytes32String('Alpha A'),
    ethers.utils.formatBytes32String('Beta B'),
  ]

  const loadFixtures = async () => {
    const Ballot = await ethers.getContractFactory('Ballot')
    const ballot = await Ballot.deploy(candidates)

    const [account1, account2, account3, account4] = await ethers.getSigners()

    return { ballot, account1, account2, account3, account4 }
  }

  it('candidates should not be empty', async () => {
    const { ballot } = await loadFixtures()
    expect(await ballot.getNumberOfCandidates()).to.equal(2)
  })

  it('should increate the vote count of the candidate by 1 after a person has voted', async () => {
    const { ballot, account1, account2 } = await loadFixtures()

    // Account 1 has voted 1st candidate
    await ballot.connect(account1).vote(0)
    expect((await ballot.proposals(0)).vote_count).to.equal(1)

    // Account 2 has voted 1st candidate
    await ballot.connect(account2).vote(0)
    expect((await ballot.proposals(0)).vote_count).to.equal(2)
  })

  it('should allow a person to vote if not voted', async () => {
    // Account 3 has not voted yet
    const { ballot, account3 } = await loadFixtures()

    await ballot.connect(account3).vote(0)
    expect((await ballot.proposals(0)).vote_count).to.equal(1)
  })

  it('should not allow a person to vote if already voted', async () => {
    // Account 1 has already voted
    const { ballot, account1 } = await loadFixtures()

    // Account 1 has voted 1st candidate
    await ballot.connect(account1).vote(0)
    expect((await ballot.proposals(0)).vote_count).to.equal(1)

    await expect(ballot.connect(account1).vote(0)).to.be.reverted
    await expect(ballot.connect(account1).vote(0)).to.be.revertedWith(
      'Already voted',
    )
  })
  it('should return the candidate with maximum number of votes as the winner', async () => {
    //  Reset All Votes
    const {
      ballot,
      account1,
      account2,
      account3,
      account4,
    } = await loadFixtures()

    expect((await ballot.proposals(0)).vote_count).to.equal(0)
    expect((await ballot.proposals(1)).vote_count).to.equal(0)

    // Account 1 and Account 2 votes 1st candidate
    await ballot.connect(account1).vote(0)
    await ballot.connect(account2).vote(0)

    // Account 3 votes 2nd candidate
    await ballot.connect(account3).vote(1)

    // Account 4 votes 1st candidate
    await ballot.connect(account4).vote(1)

    expect(await ballot.declareWinner()).to.equal(
      ethers.utils.formatBytes32String('Alpha A'),
    )
  })
})
