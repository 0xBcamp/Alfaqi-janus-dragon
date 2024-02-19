// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import hre from "hardhat";


async function main() {
  
  const BlockMedSecure = await hre.ethers.getContractFactory("BlockMedSecure");
  const blockMedSecure = await BlockMedSecure.deploy();
  //await blockMedSecure.deployed();

  console.log("BlockMedSecure deployed to:", blockMedSecure.target);

}
//this was the demo address ignore it 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })