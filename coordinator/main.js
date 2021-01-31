const { ethers } = require("ethers");
const fs = require('fs');
require('dotenv').config();

const provider = new ethers.providers.InfuraProvider("goerli", {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET
});

async function main() {
    console.log(await provider.getBlockNumber());
    let wallet = ethers.Wallet.fromEncryptedJsonSync(fs.readFileSync("wallet.json"), process.env.WALET_PASSWORD);
    console.log(wallet.address);
}

main();
