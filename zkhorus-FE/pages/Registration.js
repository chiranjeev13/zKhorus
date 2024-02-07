import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/RegistrationPage.module.css";
import { Account } from "./index.js";

const connectWallet = async () => {
  try {
    if (window.ethereum) {
      console.log("connected");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    setError(error);
  }
};


function RegistrationPage() {
    const { providerConnected, walletAddress } = useContext(Account);

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
            Connected: {walletAddress}
            <span className={styles.walletAddress}>{walletAddress}</span>
          </>
        ) : (
          "Connect Wallet"
        )}
      </button>
      <div>
        <h1 className={styles.title}>Onboarding</h1>
        <form
          className={styles.form}
          // onSubmit={handleSubmit}
        >
          {}
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
