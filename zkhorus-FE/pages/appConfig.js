"use client";
import { ethers } from "ethers";
import React, { useState, useContext, createContext, useEffect } from "react";
import abi from "../public/abi.json";
import moment, { unix } from "moment";

export const Account = createContext();

export default function AppProvider({ children }) {
  const [providerConnected, setProviderConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [proposalData, setProposalData] = useState([]);

  const contractAddress = "0x6bB302f969D33F56C1481a1d71117bE1B0eea754";

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

  const AddProposal = async (title, endtime) => {
    const ABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    var groupId = await newsignedContract._groupId();
    groupId++;
    console.log(groupId)
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
        }}
      >
        {children}
      </Account.Provider>
    </>
  );
}
