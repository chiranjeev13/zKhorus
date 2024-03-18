import React, { useContext, useState } from "react";
import styles from "../styles/HomePage.module.css";
import { Account } from "./appConfig";
import "react-calendar/dist/Calendar.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import moment from "moment";

const AddProposal = () => {
  const {
    connectWallet,
    providerConnected,
    walletAddress,
    error,
    isRegistered,
    AddProposal,
  } = useContext(Account);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [title, setTitle] = useState("");
  const handleDateTimeChange = (date) => {
    setSelectedDateTime(date);
  };

  console.log();

  const addProposal = async () => {
    const time = moment(selectedDateTime).unix();
    try {
      await AddProposal(title, time);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add a New Proposal</h1>
      <h2 className={styles.subtitle}></h2>
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
      {error && <p className={styles.error}>{error.toString()}</p>}

      <div className={styles.proposalFields}>
        <p>Proposal Title</p>
        <input type="text" onChange={(e) => setTitle(e.target.value)} />

          <DateTimePicker
            className={styles.date}
            onChange={handleDateTimeChange}
            value={selectedDateTime}
          />

        <button onClick={() => addProposal()}>Create New Proposal</button>
      </div>
    </div>
  );
};

export default AddProposal;
