// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract zKhorus {
  struct Member {
    uint256 member_id;
    address member_address;
    uint256 time_joined;
  }

  struct Proposals {
    uint256 proposalId;
    string title;
    address initiator;
    uint256 forVotes;
    uint256 againstVotes;
    uint256 forPercentage;
    uint256 againstPercentage;
    bool status;
    uint256 timeInitiated;
    uint256 totalVotes;
    uint256 tillTime;
    uint256 regtime;
  }


  Member[] public members;
  Proposals[] public proposals;

  uint256 public _proposalId = 0;
  uint256 public _memberCount = 0;
  uint256 public _groupId;
  uint256 public ver = 2;

  mapping(address => bool) public registered;
  mapping(uint256 => bool) public completed;
  mapping(uint256 => uint256) public propGroupId;
  mapping(string => uint256) public candidateName;

  
  

  uint256[] public identityCommitments;

  address public semaphoreAddress;

  function identityList() public view returns (uint256[] memory) {
    return identityCommitments;
  }

  function checkRegistered() public view returns (bool) {
    return registered[msg.sender];
  }

  constructor(address _semaphoreAddress) {
    semaphoreAddress = _semaphoreAddress;
    candidateName["Jheyanth"] = 0;
    candidateName["aakriti"] = 0;
    candidateName["Vikranth Jagdish"] = 0;
    candidateName["Gunjana Sahoo"] = 0;
    candidateName["S.Nihaarikha"] = 0;
    candidateName["Nivedita Lakshminarayanan"] = 0;
    candidateName["Sreecharan"] = 0;
    candidateName["Mohammed Farhan"] = 0;
    candidateName["Puneet"] = 0;
    candidateName["Surith L G"] = 0;
  }

  function proposalList() public view returns (Proposals[] memory) {
    return proposals;
  }

  function register(uint256 identityCommitment) public {
    require(registered[msg.sender] == false, "Already Registered");
    _memberCount++;
    members.push(Member(_memberCount, msg.sender, block.timestamp));
    registered[msg.sender] = true;
    identityCommitments.push(identityCommitment);
  }

  function addProposal(
    string memory title,
    uint256 timeEnd,
    uint256 depth,
    uint256 regtime,
    uint256 groupId
  ) public {
    require(registered[msg.sender] == true, "Not registered");
    _proposalId++;
    _groupId = groupId;
    propGroupId[_proposalId] = groupId;
    proposals.push(
      Proposals(
        _proposalId,
        title,
        msg.sender,
        0,
        0,
        0,
        0,
        true,
        block.timestamp,
        0,
        timeEnd,
        regtime
      )
    );
    ISemaphore(semaphoreAddress).createGroup(groupId, depth, address(this));
  }

  function joinProposal(uint256[] calldata identityCommitments) public {
    require(registered[msg.sender] == true, "Not a member");
    ISemaphore(semaphoreAddress).addMembers(_groupId, identityCommitments);
  }

  function voteOnproposal(
    uint256 proposalId,
    string memory name,
    uint256 vote,
    uint256 merkleTreeRoot,
    uint256 nullifierHash,
    uint256 externalNullifier,
    uint256 groupId,
    uint256[8] calldata proof
  ) public {
    require(proposals[proposalId].status == true, "Not Active");
    if (vote == 1) {
      proposals[proposalId].forVotes++;
      proposals[proposalId].totalVotes++;
      candidateName[name]++;

    } else if (vote == 0) {
      proposals[proposalId].againstVotes++;
      proposals[proposalId].totalVotes++;
    }
    ISemaphore(semaphoreAddress).verifyProof(
      groupId,
      merkleTreeRoot,
      vote,
      nullifierHash,
      externalNullifier,
      proof
    );
  }

  function statusProposals() public payable {
    for (uint256 i = 0; i < _proposalId; i++) {
      if (
        (block.timestamp - proposals[i].timeInitiated) >=
        proposals[i].tillTime &&
        completed[i] == false
      ) {
        completed[i] = true;
        proposals[i].status = false;
      }
    }
  }
}
