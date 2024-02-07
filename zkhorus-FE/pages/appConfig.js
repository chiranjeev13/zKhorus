"use client";
import { ethers } from "ethers";
import React, { useState, useContext, createContext } from "react";
import abi from "../public/abi.json";

export const Account = createContext();

export default function AppProvider({ children }) {
  const [providerConnected, setProviderConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");

  const contractAddress = "0xF355df8e79b49bFCC1d7617487BDC5e2FF342819"


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

  return (
    <>
      <Account.Provider
        value={{
          isRegistered,
          connectWallet,
          providerConnected,
          walletAddress,
          contractAddress
        }}
      >
        {children}
      </Account.Provider>
    </>
  );
}
