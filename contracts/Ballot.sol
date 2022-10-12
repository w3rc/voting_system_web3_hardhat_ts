// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

contract Ballot {

  struct Proposal {
    bytes32 name;
    uint vote_count;
  }

  struct Voter {
    bool voted;
    uint voted_candidate;
  }

  mapping(address => Voter) public voters;

  Proposal[] public proposals;

  constructor(bytes32[] memory candidateNames) {
    for (uint i = 0; i < candidateNames.length; i++) {
      proposals.push(
        Proposal({
          name: candidateNames[i],
          vote_count: 0
    })
      );
    }
  }

  function vote(uint candidate) public {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted, "Already voted");
    sender.voted = true;
    sender.voted_candidate = candidate;

    proposals[candidate].vote_count = proposals[candidate].vote_count + 1;
  }

  function countVotes() public view returns(uint winningProposal_){
    uint winningVoteCount = 0;
    for (uint p = 0; p < proposals.length; p++) {
        if (proposals[p].vote_count > winningVoteCount) {
            winningVoteCount = proposals[p].vote_count;
            winningProposal_ = p;
        }
    }
  }

  function declareWinner() external view returns(bytes32 winnerName_) {
    winnerName_ = proposals[countVotes()].name;
  }

  function getNumberOfCandidates() external view returns(uint candidatesCount_) {
    candidatesCount_ = proposals.length;
  }
}