import { Inter } from "next/font/google";
import ethers from "ethers";
import styles from "../styles/HomePage.module.css";
import React, { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [providerConnected, setProviderConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");

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
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
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
      <button
        disabled={!providerConnected}
        className={`${styles.mainBtn} ${
          providerConnected && isRegistered ? styles.getStarted : styles.onboard
        }`}
      >
        {providerConnected && isRegistered ? "Enter DAO" : "Onboard"}
      </button>
      {error && <p className={styles.error}>{error.toString()}</p>}
    </div>
  );
}
