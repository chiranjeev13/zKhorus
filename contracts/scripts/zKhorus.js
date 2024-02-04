import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import abii from "../artifacts/contracts/zKhorus.sol/zKhorus.json" assert { type: "json" };
import { ethers } from "ethers";
import dotenv from "dotenv";

const provider = new ethers.JsonRpcProvider(
  "https://rpc-mumbai.maticvigil.com"
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

const abi = abii.abi;
const signer = wallet.connect(provider);
const contractInstance = new ethers.Contract(
  "0xE2EFb567D9239Ff160228003062AaA74D479c859",
  abi,
  signer
);
//REGISTER
const tsx = await wallet.signMessage(process.env.KEY);
const identity = new Identity(tsx);

//  const txr = await contractInstance.register(identity.commitment);
//  console.log(txr);


// ADD Proposal

var time = new Date().getTime().toString();

// const txrr = await contractInstance.addProposal(
//   "test",
//   time + 10000,
//   16,
//   time + 2000,
//   1305
// );

// console.log(await contractInstance._proposalId());

console.log(BigInt(identity.commitment))
const f = await contractInstance.joinProposal(1305, identity.commitment);
console.log(f)
