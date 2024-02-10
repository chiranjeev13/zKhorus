"use client";
import { Inter } from "next/font/google";
import styles from "../styles/HomePage.module.css";
import React, { useState, useContext, createContext } from "react";
import Link from "next/link";
import { Account } from "./appConfig";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {
    providerConnected,
    walletAddress,
    isRegistered,
    error,
    connectWallet,
  } = useContext(Account);
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
    </>
  );
}
