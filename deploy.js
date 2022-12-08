// Compile separately

// Import ethers js
const ethers = require("ethers");
const fs = require("fs");

async function main() {
  // Ganache Test Blockchain: http://127.0.0.1:8545
  // Link script to the local blockchain
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

  // Connect a ganache account
  const wallet = new ethers.Wallet(
    "0x12fa2277b4bb3a36dffea553ecddb59fcb1f057c7061b07bff2e5ffb894d0fa3",
    provider
  );

  // Take ABI and binary code in order to interact with the contract
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

  // Create an object used to deploy contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying...");
  // Deploy contract
  const contract = await contractFactory.deploy();
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });