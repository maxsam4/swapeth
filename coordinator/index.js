const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();
const config = JSON.parse(fs.readFileSync("config.json"));
const db = JSON.parse(fs.readFileSync("db.json"));
const wallet = ethers.Wallet.fromEncryptedJsonSync(fs.readFileSync("wallet.json"), process.env.WALET_PASSWORD);
const abi = JSON.parse(fs.readFileSync("./artifacts/SwapETH.json")).abi;
let providers = new Map();
let balances = new Map();
let signers = new Map();
let contracts = new Map();
let logs = [];
const maxDelay = 15 * 60 * 1000;

async function main() {
    try {
        fs.closeSync(fs.openSync("LOCK", "wx"));
    } catch (error) {
        const { birthtime } = fs.statSync("LOCK");
        if (birthtime.getTime() < Date.now() - maxDelay) {
            console.log("Seems like the previous execution got stuck. Clearing lock");
        } else {
            console.log(error);
            process.exit(1);
        }
    }

    await init();
    await payOut();
    fs.writeFileSync("db.json", JSON.stringify(db, null, 4));
    try { fs.unlinkSync("LOCK"); } catch(err) {}
}

async function init() {
    console.log(wallet.address);
    return Promise.all(Object.entries(config.networks).map(async ([networkName, network]) => {
        providers.set(
            networkName,
            new ethers.providers.InfuraProvider(networkName, {
                projectId: process.env.INFURA_PROJECT_ID,
                projectSecret: process.env.INFURA_PROJECT_SECRET
            })
        );
        signers.set(networkName, wallet.connect(providers.get(networkName)));
        contracts.set(networkName, new ethers.Contract(network.contractAddress, abi, signers.get(networkName)));
        await parseLogs(networkName);
        balances.set(networkName, await providers.get(networkName).getBalance(network.contractAddress));
    }));
}

async function parseLogs(networkName) {
    let lastProcessedBlock = parseInt(db.networks[networkName].lastProcessedBlock);
    const scanWindow = parseInt(config.networks[networkName].scanWindow);
    const confirmationBlocks = parseInt(config.networks[networkName].confirmationBlocks);
    const replayWindow = parseInt(config.networks[networkName].replayWindow);
    const contract = contracts.get(networkName);
    const processAbleBlock = await contract.provider.getBlockNumber() - confirmationBlocks;
    const startBlock = lastProcessedBlock - replayWindow;

    if (lastProcessedBlock > processAbleBlock) {
        return;
    }

    let endBlock = startBlock + scanWindow;
    if (endBlock > processAbleBlock) {
        endBlock = processAbleBlock;
    }

    console.log(`Processing ${processAbleBlock - lastProcessedBlock + 1} blocks on ${networkName}`);

    let newLogs = [];
    for (let tries = 0; tries < 15; tries++) {
        try {
            newLogs = await contract.queryFilter("Received", startBlock, endBlock);
            break;
        } catch(err) {
            console.log(err);
            endBlock = Math.floor(endBlock/2);
        }
    }
    db.networks[networkName].lastProcessedBlock = endBlock;
    newLogs.forEach((log) => {
        let toNetwork;
        switch (log.args[3]) {
            case 0:
                toNetwork = "ropsten";
                break;
            case 1:
                toNetwork = "rinkeby";
                break;
            case 2:
                toNetwork = "kovan";
                break;
            default:
                toNetwork = "goerli";
        }
        logs.push(log.args.concat([networkName, toNetwork]));
    });
}

async function payOut() {
    let transferQueue = new Map();
    logs.forEach((log) => {
        const incomingNetwork = log[4];
        const incomingAmount = log[2];
        const outgoingNetwork = log[5];
        let incomingNetworkIndex;
        switch (incomingNetwork) {
            case "ropsten":
                incomingNetworkIndex = 0;
                break;
            case "rinkeby":
                incomingNetworkIndex = 1;
                break;
            case "kovan":
                incomingNetworkIndex = 2;
                break;
            default:
                incomingNetworkIndex = 3;
        }
        // outgoingAmount = incomingAmount * outgoingBalance / incomingBalance - gasFee;
        let outgoingAmount = incomingAmount.mul(balances.get(outgoingNetwork)).div(balances.get(incomingNetwork)).sub(100000);
        if (outgoingAmount <= 0) {
            return;
        }
        balances.set(outgoingNetwork, balances.get(outgoingNetwork).sub(outgoingAmount));
        if (transferQueue.has(outgoingNetwork)) {
            let queue = transferQueue.get(outgoingNetwork);
            queue.to.push(log[1]);
            queue.amount.push(outgoingAmount);
            queue.from.push(incomingNetworkIndex);
            queue.fromNonce.push(log[0]);
            transferQueue.set(outgoingNetwork, queue);
        } else {
            transferQueue.set(outgoingNetwork, {
                to: [log[1]],
                amount: [outgoingAmount],
                from: [incomingNetworkIndex],
                fromNonce: [log[0]]
            });
        }
    })
    let promises = [];
    console.log(transferQueue);
    transferQueue.forEach(async (txQueue, networkName) => {
        const contract = contracts.get(networkName);
        for (let i = 0; i < txQueue.to.length; i += 100) {
            let lastElement = i + 100;
            if (lastElement > txQueue.to.length) {
                lastElement = txQueue.to.length;
            }
            promises.push(contract.batchTransfer(
                txQueue.to.slice(i, lastElement),
                txQueue.amount.slice(i, lastElement),
                txQueue.from.slice(i, lastElement),
                txQueue.fromNonce.slice(i, lastElement)
            ));
        }
    })
    return Promise.all(promises);
}

main();
