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
  console.log(moment(selectedDateTime).unix());

  const addProposal = async () => {
    const time = Math.abs(moment().unix() - moment(selectedDateTime).unix());
    try {
      await AddProposal(title, time);
    } catch (error) {
      console.log(error);
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

        <div>
          <DateTimePicker
            onChange={handleDateTimeChange}
            value={selectedDateTime}
          />
        </div>

        <button onClick={() => addProposal()}>Create New Proposal</button>
      </div>
    </div>
  );
};

export default AddProposal;
