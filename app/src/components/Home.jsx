import { Box } from '@material-ui/core';
import { ethers, utils } from 'ethers';
import React, { useState, useEffect } from 'react'
import Config from '../Config'
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import Header from './Header';
import Swap from './Swap';
import CustomAlert from './CustomAlert';

const supportedNetworks = ['ropsten' , 'rinkeby','kovan', 'goerli'];

function Home() {

    const [web3, setupWeb3] = useState({
        account: null,
        provider: null,
        network: null,
        contractInstance: null,
    });

    const [amount, setAmount] = useState('');
    const [toNetwork, setToNetwork] = useState(null);
    const [isConnectedToWallet, setIsConnectedToWallet] = useState(false);
    const [ alert, setAlert ] = useState({severity: null, message: '', inActive: false});

    useEffect(() => {
        const ethereum = window.ethereum;
        if (!ethereum) {
            setAlert({severity: 'error', message: 'Please install Metamask', inActive: true})
        }
        else {
            ethereum.on('accountsChanged', _ => {
            connectToWallet();
            
            });
        }
    }, []);

    const handleToNetwork = (newNetwork) => {
        setToNetwork(newNetwork)
    }

    const handleAmount = (event) => {
        setAmount(event.target.value)
    }

    const connectToWallet = async (event) => {
        event.preventDefault();
        try {
            const ethereum = window.ethereum;
            await ethereum.enable();
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const network = (await provider.detectNetwork()).name

            if(!supportedNetworks.includes(network)) {
                setAlert({severity: 'error', message: `${network} is not supported`, inActive: true})
            }

            provider.on("network", ( _, oldNetwork ) => {
                if (oldNetwork) {
                    window.location.reload();
                }
            });

            const signer = await provider.getSigner()
            const account = await signer.getAddress()
            const contractInstance = await new ethers.Contract(Config.addresses[network], Config.abi, signer).deployed();

            setupWeb3({
                account,
                provider,
                network,
                contractInstance
            });
        } catch (e) {
            setAlert({severity: 'error', message: `${e.message}`, inActive: true})
        }

        setIsConnectedToWallet(true);
    }


    const swapEth = async (event) => {
        event.preventDefault();
        let tx;
        try {
            console.log("Inside SwapEth", toNetwork, amount)
            tx = await web3.contractInstance.swap(supportedNetworks.indexOf(toNetwork), { value: utils.parseUnits(amount, 'ether') });
            console.log("contractInstance", tx)
        } catch (e) {
            setAlert({severity: 'error', message: `${e.message}`, inActive: false})
            return;
        }
        tx.wait();
        setAlert({severity: 'success', message: `Swap completed sucessfully! You will get swapped ETH in few minutes.`, inActive: false})
    }
    
    const swapComponentProps = {
        amount,
        isConnectedToWallet,
        toNetwork,
        currentNetwork: web3.network,
        supportedNetworks,
        //Function props
        handleToNetwork,
        handleAmount,
    }


    return (
        <Box textAlign = "center" fontSize ="xl" >
            <ColorModeSwitcher justifySelf = "flex-end" />
            <Header connectToWallet = { connectToWallet } isConnectedToWallet = { isConnectedToWallet } />
            <Swap connectToWallet = {(!isConnectedToWallet) ? connectToWallet : swapEth } { ...swapComponentProps } />
            { !!alert.severity && <CustomAlert severity = {alert.severity} message = {alert.message} /> }
        </Box>
    )
    
}

export default Home
