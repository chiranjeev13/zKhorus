import hre from "hardhat"
import dotenv from "dotenv"
async function main() {

  const _semaphoreAddress = "0x74cd45f69d0ee2abad147bbd882f33b72992d872";
  const lock = await hre.ethers.deployContract("zKhorus", [
    _semaphoreAddress,
  ]);

  await lock.waitForDeployment();
  console.log(lock.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});