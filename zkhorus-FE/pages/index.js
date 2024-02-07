"use client";
import { Inter } from "next/font/google";
import { ethers } from "ethers";
import styles from "../styles/HomePage.module.css";
import React, { useState, useContext, createContext } from "react";
import abi from "../public/abi.json";
import Link from "next/link";
import { Account } from "./appConfig";

const inter = Inter({ subsets: ["latin"] });


export default function Home({ children }) {
  const [providerConnected, setProviderConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");

  const contractAddress = "0xF355df8e79b49bFCC1d7617487BDC5e2FF342819";

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
      <div className={styles.container}>
        <h1 className={styles.title}>zKhorus</h1>
        <h2 className={styles.subtitle}>Explore DAO x zkP</h2>
        <button
          className={`${styles.connectButton} ${
            providerConnected ? styles.connected : ""
          }`}
          onClick={connectWallet}
          disabled={providerConnected}
        >
          {providerConnected ? (
            <>
              Connected:{" "}
              <span className={styles.walletAddress}>{walletAddress}</span>
            </>
          ) : (
            "Connect Wallet"
          )}
        </button>
        {providerConnected && isRegistered && (
          <Link
            disabled={!providerConnected}
            className={`${styles.mainBtn} ${
              providerConnected && isRegistered
                ? styles.getStarted
                : styles.onboard
            }`}
            href="/Dashboard"
          >
            Enter DAO
          </Link>
        )}

        {providerConnected && !isRegistered && (
          <Link
            disabled={!providerConnected}
            className={`${styles.mainBtn} ${
              providerConnected && isRegistered
                ? styles.getStarted
                : styles.onboard
            }`}
            href="/Registration"
          >
            Onboard
          </Link>
        )}

        {error && <p className={styles.error}>{error.toString()}</p>}
      </div>

      <Account.Provider
        value={{
          isRegistered,
          connectWallet,
          providerConnected,
          walletAddress,
        }}
      >
        {children}
      </Account.Provider>
    </>
  );
}
