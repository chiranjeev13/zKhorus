require("dotenv").config();
const { Defender } = require("@openzeppelin/defender-sdk");
const { ethers } = require("ethers");
const abi = require("../../../contracts/artifacts/contracts/zKhorus.sol/zkhorus.json");

export default async function handler(req, res) {
  var { fullProof, proposalId, vote, groupId, contractAddress } = req.query;

  const a = "54WiU9XNzk1qrSLJyBtKnyLbUhv2Rk9w";
  const b = "3H6av5VZnFGS6sFF8FxYbb5wg72zoeHpNTsdwfHQgzp6BNz9XesrWt9FNk1MGmUX";
  const client = new Defender({
    apiKey: "5aLVb8hP2HpAxB37hoS5jJricBMqJ8En",
    apiSecret:
      "3H6av5VZnFGS6sFF8FxYbb5wg72zoeHpNTsdwfHQgzp6BNz9XesrWt9FNk1MGmUX",
    relayerApiKey: a,
    relayerApiSecret: b,
  });

  try {
    const provider = client.relaySigner.getProvider();
    const signer = client.relaySigner.getSigner(provider, { speed: "fast" });
    const ABI = abi.abi;
    const newsignedContract = new ethers.Contract(contractAddress, ABI, signer);

    fullProof = JSON.parse(fullProof);

    const tx = await newsignedContract.voteOnproposal(
      proposalId - 1,
      vote,
      fullProof.merkleTreeRoot,
      fullProof.nullifierHash,
      fullProof.externalNullifier,
      parseInt(groupId),
      fullProof.proof
    );

    res.status(200).json(tx);
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
}
