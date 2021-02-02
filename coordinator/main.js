const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();
const config = JSON.parse(fs.readFileSync("config.json"));
const wallet = ethers.Wallet.fromEncryptedJsonSync(fs.readFileSync("wallet.json"), process.env.WALET_PASSWORD);
const abi = JSON.parse(fs.readFileSync("./artifacts/SwapETH.json")).abi;
let providers = new Map();
let balances = new Map();
let signers = new Map();
let contracts = new Map();
let logs = [];

async function main() {
    console.log(wallet.address);
    await Promise.all(config.networks.map(async (network, index) => {
        providers.set(
            index,
            new ethers.providers.InfuraProvider(network.networkName, {
                projectId: process.env.INFURA_PROJECT_ID,
                projectSecret: process.env.INFURA_PROJECT_SECRET
            })
        );
        balances.set(index, await providers.get(index).getBalance(network.contractAddress));

        signers.set(index, wallet.connect(providers.get(index)));
        contracts.set(index, new ethers.Contract(network.contractAddress, abi, signers.get(index)));
        await parseLogs(index);
    }));
    console.log(logs);
}

async function parseLogs(index) {
    let newLogs = await contracts.get(index).queryFilter("Received", parseInt(config.networks[index].deploymentBlock));
    newLogs.forEach((log) => {
        logs.push(log.args.concat([index]));
    });
}
main();
