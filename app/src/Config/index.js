const Config = {
    abi: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "enum SwapETH.Testnet",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "name": "Received",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable[]",
                    "name": "to",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "amount",
                    "type": "uint256[]"
                },
                {
                    "internalType": "enum SwapETH.Testnet[]",
                    "name": "from",
                    "type": "uint8[]"
                },
                {
                    "internalType": "uint64[]",
                    "name": "fromNonce",
                    "type": "uint64[]"
                }
            ],
            "name": "batchTransfer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "nonce",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "passBaton",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "enum SwapETH.Testnet",
                    "name": "to",
                    "type": "uint8"
                }
            ],
            "name": "swap",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "enum SwapETH.Testnet",
                    "name": "from",
                    "type": "uint8"
                },
                {
                    "internalType": "uint64",
                    "name": "fromNonce",
                    "type": "uint64"
                }
            ],
            "name": "transfer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ],
    addresses: {
        ropsten: '0xdB2cE0E821c0C89eF1c2B4CF666952C722B9F2Cc',
        rinkeby: '0xdB2cE0E821c0C89eF1c2B4CF666952C722B9F2Cc',
        kovan: '0xa96A639b2Bc3b17bAf6ca4F4A153C5B84Cd99C15',
        goerli: '0xa96A639b2Bc3b17bAf6ca4F4A153C5B84Cd99C15',
    }
};

export default Config;