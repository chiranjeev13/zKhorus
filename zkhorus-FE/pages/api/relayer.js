require("dotenv").config();
const { Defender } = require("@openzeppelin/defender-sdk");
const { ethers } = require("ethers");
const abi = require("../../zKhorus.json");

export default async function handler(req, res) {
  var { fullProof, proposalId, vote, groupId, contractAddress, name } =
    req.query;

  const client = new Defender({
    apiKey: process.env.apiKey,
    apiSecret: process.env.relayerApiSecret,
    relayerApiKey: process.env.relayerApiKey,
    relayerApiSecret: process.env.relayerApiSecret,
  });

  try {
    const provider = client.relaySigner.getProvider();
    const signer = client.relaySigner.getSigner(provider, { speed: "fast" });
    const ABI = abi.abi;
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);

    fullProof = JSON.parse(fullProof);

    const tx = await newsignedContract.voteOnproposal(
      proposalId - 1,
      name,
      vote,
      fullProof.merkleTreeRoot,
      fullProof.nullifierHash,
      fullProof.externalNullifier,
      parseInt(groupId),
      fullProof.proof
    );

    res.status(200).json(tx);
  } catch (error) {
    res.status(500).json(error);
  }
}
