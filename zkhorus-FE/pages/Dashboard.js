import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import { Account } from "./appConfig";
import moment from "moment";
import Link from "next/link";

function Dashboard() {
  const {
    providerConnected,
    walletAddress,
    connectWallet,
    proposalData,
    AddProposal,
    VoteOnproposal,
    candidateName,
  } = useContext(Account);

  var Names = [
    "Jheyanth",
    "aakriti",
    "Vikranth Jagdish",
    "Gunjana Sahoo",
    "S.Nihaarikha",
    "Nivedita Lakshminarayanan",
    "Sreecharan",
    "Mohammed Farhan",
    "Puneet",
    "Surith L G",
  ];

  const a = async (name) => {
    candidateName(name);
  };

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

      <Link className={styles.addProposalBtn} href="/AddProposal">
        Add Proposal
      </Link>

      <div className={styles.fix}>
        <div className={styles.userInfo}></div>
        <h1 className={styles.title}>zKhorus Dashboard</h1>
        <div className={styles.userInfo}>UNIVERSAL RELAYER ADDRESS</div>
        <a
          className={styles.wallet}
          href="https://sepolia.scrollscan.com/address/0x82c65626C032Fd234875047557404d9e9b603012"
          target="_blank"
        >
          0x82c65626C032Fd234875047557404d9e9b603012
        </a>
      </div>

      <div className={styles.proposalGrid}>
        <section className={styles.activeProposalSection}>
          {proposalData
            .filter((x) => x[7] === true)
            .map((proposal, index) => (
              <div className={styles.proposalBox}>
                <p>Proposal Id - {parseInt(proposal[0]._hex)}</p>
                <p>Proposal Title - {proposal[1]}</p>
                <div className={styles.votes}>
                  {Names.map((a) => (
                    <>
                      <p>{a}</p>
                      <button className={styles.yes}
                        onClick={(e) =>
                          VoteOnproposal(a,parseInt(proposal[0]._hex), 1)
                        }
                      >
                        Yes
                      </button>
                    </>
                  ))}
                </div>
                <div className={styles.votesBox}></div>
                <div className={styles.votesBox}>
                  <p>
                    Time Initiated :{" "}
                    {moment
                      .unix(parseInt(proposal[8]._hex))
                      .format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                  <p>
                    Time Left From Initiation :{" "}
                    {console.log(parseInt(proposal[10]._hex))}
                    {moment
                      .unix(parseInt(proposal[10]._hex))
                      .format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </div>
              </div>
            ))}
        </section>
        <section className={styles.closedProposalSection}>
          {proposalData
            .filter((x) => x[7] === false)
            .map((proposal, index) => (
              <div className={styles.proposalBoxComplete}>
                <p>Proposal Id - {parseInt(proposal[0]._hex)}</p>
                <p>Proposal Title - {proposal[1]}</p>

                <div className={styles.votesBox}></div>
                <div className={styles.votesBox}>
                  <p>
                    Time Initiated :{" "}
                    {moment
                      .unix(parseInt(proposal[8]._hex))
                      .format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                  <p>
                    Time Left From Initiation <b>CLOSED</b>
                  </p>
                </div>
              </div>
            ))}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
