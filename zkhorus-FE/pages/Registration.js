import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/RegistrationPage.module.css";
import { Account } from "./appConfig";
import abi from "../public/abi.json";
import { Identity } from "@semaphore-protocol/identity";
import { ethers } from "ethers";
import axios from "axios";

const registerr = async (contractAddress, walletAddress) => {
  const ABI = abi.abi;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log(walletAddress);
  const digest = await axios.get(
    `https://zkhorus-api-service.vercel.app/api/identitycommitment?wallet=${walletAddress}`
  );

  console.log(digest.data.hash);
  const tsx = digest.data.hash;
  const identity = new Identity(tsx);
  const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
  const Registered = await newsignedContract.register(identity.commitment);
  console.log(Registered);
};

function RegistrationPage() {
  const { providerConnected, walletAddress, connectWallet, contractAddress } =
    useContext(Account);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.connectButton} ${
          providerConnected ? styles.connected : ""
        }`}
        onClick={connectWallet}
      >
        {providerConnected ? (
          <>
            Connected:
            <span className={styles.walletAddress}>{walletAddress}</span>
          </>
        ) : (
          "Connect Wallet"
        )}
      </button>
      <div>
        <h1 className={styles.title}>Onboarding</h1>
        <form className={styles.form}>to be filled</form>
      </div>
      <button
        className={styles.submitButton}
        onClick={() => registerr(contractAddress, walletAddress)}
      >
        Submit
      </button>
    </div>
  );
}

export default RegistrationPage;
