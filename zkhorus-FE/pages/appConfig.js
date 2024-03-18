"use client";
import { ethers } from "ethers";
import React, { useState, useContext, createContext, useEffect } from "react";
import abi from "../zKhorus.json";
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
  const contractAddress = "0xcD0e20Db412dD0d5abC5DDd2e82Bb347451b3462";

  const requestAccount = async () => {
    const accns = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
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

    const group = new Group(groupId._hex, 16);
    group.addMember(arr);

    const fullProof = await Proof.generateProof(
      identity,
      group,
      group.root,
      vote
    );

    try {
      const tx = await axios.get(
        `https://z-khorus.vercel.app/api/relayer?fullProof=${JSON.stringify(
          fullProof
        )}&proposalId=${proposalId}&vote=${vote}&groupId=${parseInt(
          group.id
        )}&contractAddress=${contractAddress}`
      );
      if (
        window.confirm("VOTE CONFIRMED VIA zkPs.Click Ok to view the Reciept")
      ) {
        console.log(tx.data);
        window.location.href = `https://mumbai.polygonscan.com/tx/${tx.data.hash}`;
      }
    } catch (error) {
      alert(error.response.data.reason);
    }
  };

  const AddProposal = async (title, endtime) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    var groupId = await newsignedContract._groupId();
    groupId++;
    console.log(groupId);
    if (groupId === 1) {
      groupId = 1568;
    }
    const tx = await newsignedContract.addProposal(
      title,
      endtime,
      "16",
      moment().unix(),
      groupId
    );
    alert("Wait for Another tx for Adding Identity Commitments");
    await tx.wait();
    const identityCommitments = await newsignedContract.identityList();
    var arr = [];
    identityCommitments.map((id) => {
      arr.push(BigInt(id._hex));
    });
    console.log(arr);
    await newsignedContract.joinProposal(arr);
    window.location.assign("/Dashboard");
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
