import React from 'react'
import { Paper, makeStyles, Button, Typography} from '@material-ui/core';
import { Badge, useColorModeValue } from '@chakra-ui/react';

const useStyles = makeStyles({
    header: {
        padding: '1.2rem',
        backgroundColor: props =>  props.bg,
        color: props => props.color,
        display: 'flex',
        justifyContent: 'center'
    },
    navbar_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        position: 'absolute',
        right: '20%'
    },
    connect_to_wallet: {
        color: 'white',
        backgroundColor: 'rgb(22,111,129)',
        '&:hover':{
            color: 'white',
            backgroundColor: 'rgb(22,111,129)',
            boxShadow: '2px 2px 2px 5px rgb(22,111,129)'
        },
        borderRadius: '15px 15px 15px 15px'
     },
     title: {
         fontWeight: '800'
     }
})


function Header( {connectToWallet, isConnectedToWallet} ) {
    const bg = useColorModeValue('white', 'rgb(26,32,44)');
    const color = useColorModeValue('black', 'white')
    const classes = useStyles({bg, color});
    return (
        <div>
           <Paper className = {classes.header}>
               <div className = {classes.navbar_container}>
               <Typography className = {classes.title} variant = 'h4'>SwapETH</Typography>
                   </div>
                   { !isConnectedToWallet &&
                    <div className = {classes.button}>
                    <Button className = {classes.connect_to_wallet} onClick = {connectToWallet}> Connect to Metamask </Button>
                    </div>
                    }
                    {
                        isConnectedToWallet && 
                        <div className = {classes.button}>
                            <Badge colorScheme="green">Connected to Metamask</Badge>
                            </div>
                    }
               </Paper> 
        </div>
    )
}

export default Header
