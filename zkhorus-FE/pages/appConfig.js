"use client";
import { ethers } from "ethers";
import React, { useState, useContext, createContext, useEffect } from "react";
import abi from "../public/abi.json";
import moment from "moment";
import axios from "axios";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
const Proof = require("@semaphore-protocol/proof");

export const Account = createContext();

export default function AppProvider({ children }) {
  const [providerConnected, setProviderConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [proposalData, setProposalData] = useState([]);
  const ABI = abi.abi;
  const contractAddress = "0x4dbdf9CF773de1A71D39f02f1Be66860393abBBC";

  const requestAccount = async () => {
    const accns = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accns);
    setProviderConnected(true);
    setWalletAddress(accns[0]);
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        console.log("connected");
        setIsRegistered(await IsRegistered());
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setError(error);
    }
  };

  const getProposals = async () => {
    const ABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const providerContract = new ethers.Contract(contractAddress, ABI, signer);
    const proposals = await providerContract.proposalList();
    const proposalCount = await providerContract._proposalId();
    setProposalData(proposals);
    console.log(proposalData);
    console.log(proposalCount);
  };
  useEffect(() => {
    getProposals();
    connectWallet();
  }, [providerConnected]);

  const IsRegistered = async () => {
    const ABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    const Registered = await newsignedContract.registered(
      await signer.getAddress()
    );
    console.log(Registered);
    return Registered;
  };

  const VoteOnproposal = async (proposalId, vote) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const digest = await axios.get(
      `https://zkhorus-api-service.vercel.app/api/identitycommitment?wallet=${await signer.getAddress()}`
    );
    const tsx = digest.data.hash;
    const identity = new Identity(tsx);
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);

    const groupId = await newsignedContract.propGroupId(proposalId);
    const identityCommitments = await newsignedContract.identityList();
    var arr = [];
    identityCommitments.map((id) => {
      arr.push(BigInt(id._hex));
    });
    console.log(groupId);
    const group = new Group(groupId, 16, arr);

    const fullProof = await Proof.generateProof(
      identity,
      group,
      group.root,
      vote
    );
    console.log(fullProof.merkleTreeRoot);
    console.log(fullProof.nullifierHash);
    console.log(fullProof.externalNullifier);
    console.log(fullProof.proof);
    console.log(proposalId, vote);
    console.log(parseInt(group.id));

    await newsignedContract.voteOnproposal(
      proposalId - 1,
      vote,
      fullProof.merkleTreeRoot,
      fullProof.nullifierHash,
      fullProof.externalNullifier,
      parseInt(group.id),
      fullProof.proof,
    );
    
  };

  const AddProposal = async (title, endtime) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    var groupId = await newsignedContract._groupId();
    groupId++;
    console.log(groupId);
    await newsignedContract.addProposal(
      title,
      endtime,
      "16",
      moment().unix(),
      groupId
    );
    const identityCommitments = await newsignedContract.identityList();
    var arr = [];
    identityCommitments.map((id) => {
      arr.push(BigInt(id._hex));
    });
    await newsignedContract.joinProposal(arr);
  };

  return (
    <>
      <Account.Provider
        value={{
          isRegistered,
          connectWallet,
          providerConnected,
          walletAddress,
          contractAddress,
          proposalData,
          AddProposal,
          VoteOnproposal,
        }}
      >
        {children}
      </Account.Provider>
    </>
  );
}
