import hre from "hardhat";
import dotenv from "dotenv";
async function main() {
  const _semaphoreAddress = "0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131";
  const lock = await hre.ethers.deployContract("zKhorus", [_semaphoreAddress]);

  await lock.waitForDeployment();

  console.log(lock.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
