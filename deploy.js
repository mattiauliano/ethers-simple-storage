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
    "0x40ce3eaa97beab46c74c71046a059cfcda3f8009804a62785000c7eab0cf4902",
    provider
  );

  // Take ABI and binary code in order to interact with the contract
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

  // Create an object used to deploy contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying...");
  // Deploy contract
  // Curly braces as parameter allow us to override specific properties
  const contract = await contractFactory.deploy();
  // Wait 1 block confirmation
  await contract.deployTransaction.wait(1);

  // Interact with the contract
  const currentFavoriteNumber =  await contract.retrieve();
  console.log(`Favorite Number: ${currentFavoriteNumber.toString()}`);
  
  // This is a transaction
  const transactionResponse = await contract.store("15");
  const transactionReceipt = await transactionResponse.wait(1);

  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated Favorite Number: ${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });