import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/RegistrationPage.module.css";
import { Account } from "./appConfig";
import abi from "../zKhorus.json"
import { Identity } from "@semaphore-protocol/identity";
import { ethers } from "ethers";
import axios from "axios";

function RegistrationPage() {
  const [identityCommitment, setIdentityCommitment] = useState();
  const [identityTrapdoor, setIdentityTrapdoor] = useState();
  const [identityNullifier, setIdentityNullifier] = useState();
  const [formData, setFormData] = useState({
    question1:
      "Do you have prior experience or knowledge in the field of [specific field relevant to the DAO]?",
    question2:
      "Are you excited about joining the DAO community and actively participating in its activities?",
    question3:
      "Are you interested in collaborating with other members of the DAO to work on projects or initiatives?",
    question4:
      "Would you support the idea of creating a mentorship program within the DAO to help beginners in the field?",
    question5:
      "Should the DAO allocate resources to develop comprehensive educational materials and resources?",
  });

  const [formRes, setFormRes] = useState({
    res1: "",
    res2: "",
    res3: "",
    res4: "",
    res5: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormRes((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const iden = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const digest = await axios.get(
      `https://zkhorus-api-service.vercel.app/api/identitycommitment?wallet=${await signer.getAddress()}`
    );
    const tsx = digest.data.hash;
    const identity = new Identity(tsx);
    setIdentityCommitment(identity.commitment);
    setIdentityTrapdoor(identity.trapdoor);
    setIdentityNullifier(identity.nullifier);
  };
  const registerr = async (contractAddress) => {
    const ABI = abi.abi;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const digest = await axios.get(
      `https://zkhorus-api-service.vercel.app/api/identitycommitment?wallet=${await signer.getAddress()}`
    );
    console.log(digest.data.hash);
    const tsx = digest.data.hash;
    const identity = new Identity(tsx);
    setIdentityCommitment(identity.commitment);
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);
    try {
      const tx = await newsignedContract.register(identity.commitment);
      await tx.wait();
      window.location.assign("/Dashboard");
    } catch (err) {
      alert(err.error.data.message);
    }
  };
  const renderFormPage = () => {
    return (
      <>
        <div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{formData.question1}</label>
            <input
              type="text"
              name="res1"
              onChange={handleInputChange}
              value={formRes.res1}
              className={styles.formInput}
              required
              disabled={!providerConnected}
            />
          </div>
        </div>

        <div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{formData.question2}</label>
            <input
              type="text"
              name="res2"
              onChange={handleInputChange}
              value={formRes.res2}
              className={styles.formInput}
              required
              disabled={!providerConnected}
            />
          </div>
          {/* <button className={styles.prevButton} onClick={handlePrevPage}>
              Previous
            </button> */}
        </div>

        <div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{formData.question3}</label>
            <input
              type="text"
              name="res3"
              onChange={handleInputChange}
              value={formRes.res3}
              className={styles.formInput}
              required
              disabled={!providerConnected}
            />
          </div>
          {/* <button className={styles.prevButton} onClick={handlePrevPage}>
              Previous
            </button> */}
        </div>

        <div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{formData.question4}</label>
            <input
              type="text"
              name="res4"
              onChange={handleInputChange}
              value={formRes.res4}
              className={styles.formInput}
              required
              disabled={!providerConnected}
            />
          </div>
          {/* <button className={styles.prevButton} onClick={handlePrevPage}>
              Previous
            </button> */}
        </div>

        <div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{formData.question5}</label>
            <input
              type="text"
              onChange={handleInputChange}
              value={formRes.res5}
              name="res5"
              className={styles.formInput}
              required
              disabled={!providerConnected}
            />
          </div>
        </div>
      </>
    );
  };
  const { providerConnected, walletAddress, connectWallet, contractAddress } =
    useContext(Account);
  useEffect(() => {
    iden();
  }, []);

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
      </div>
      <form className={styles.form}>{renderFormPage()}</form>
      {identityCommitment && (
        <>
          <button
            className={styles.submitButton}
            onClick={() => registerr(contractAddress, walletAddress)}
          >
            Submit
          </button>
          <div>Identity commitment - {identityCommitment.toString()}</div>
          <div>Identity trapdoor - {identityTrapdoor.toString()}</div>
          <div>Identity nullifier - {identityNullifier.toString()}</div>
        </>
      )}
    </div>
  );
}

export default RegistrationPage;
