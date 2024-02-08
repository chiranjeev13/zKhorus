const { Group } = require("@semaphore-protocol/group");
const { Identity } = require("@semaphore-protocol/identity");

const { generateProof } = require("@semaphore-protocol/proof");
const abii = require("../artifacts/contracts/zKhorus.sol/zKhorus.json");
const { ethers } = require("ethers");
require("dotenv");



const provider = new ethers.JsonRpcProvider(
  "https://scroll-testnet-public.unifra.io"
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

const abi = abii.abi;
const signer = wallet.connect(provider);
const contractInstance = new ethers.Contract(
  "0xF355df8e79b49bFCC1d7617487BDC5e2FF342819",
  abi,
  signer
);
//REGISTER

async function registerIdentity() {
  const tsx = await wallet.signMessage(process.env.KEY);
  const identity = new Identity(tsx);

  console.log(identity);
  // const txr = await contractInstance.register(identity.commitment);
  // console.log(txr);

  // // ADD Proposal

<<<<<<< HEAD
  // var time = new Date().getTime().toString()
  // const txrr = await contractInstance.addProposal(
  //   "test",
  //   time + 10000,
  //   16,
  //   time + 2000,
  //   1032
  // );
=======
  var time = new Date().getTime().toString();

  const txrr = await contractInstance.addProposal(
    "test",
    time + 10000,
    16,
    time + 2000,
    1325
  );
>>>>>>> 5559a69c3fd9f146936834aae28af8e791c71c78

   console.log(txrr)

  // // // console.log(await contractInstance._proposalId());

  // // console.log(BigInt(identity.commitment))
  // const f = await contractInstance.joinProposal(1, identity.commitment);
  // console.log(f)

<<<<<<< HEAD
  // const group = new Group(1032, 16);
=======
  // const group = new Group(1315, 16);
>>>>>>> 5559a69c3fd9f146936834aae28af8e791c71c78

  // group.addMember(identity.commitment);

  // const fullProof = await generateProof(identity, group, group.root, "1", {
  //   zkeyFilePath: "./scripts/semaphore.zkey",
  //   wasmFilePath: "./scripts/semaphore.wasm",
  // });

  // console.log(fullProof);

  // const txs = await contractInstance.voteOnproposal(
  //   "0",
  //   "1",
  //   fullProof.merkleTreeRoot,
  //   fullProof.nullifierHash,
  //   fullProof.externalNullifier,
<<<<<<< HEAD
  //   "1032",
  //   fullProof.proof,
  // );

  console.log(txs);
=======
  //   "1315",
  //   fullProof.proof,
  // );

  //  console.log(txs);
>>>>>>> 5559a69c3fd9f146936834aae28af8e791c71c78
}

registerIdentity();
