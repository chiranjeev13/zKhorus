const hre = require("hardhat");

require("dotenv").config()
async function main() {

  const _semaphoreAddress = "0xff782092C9f433686dCE8C21Eec2dCebEbfAE09d";
  const lock = await hre.ethers.deployContract("zKhorus", [
    _semaphoreAddress,
  ]);

  await lock.waitForDeployment();

  console.log(lock);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});