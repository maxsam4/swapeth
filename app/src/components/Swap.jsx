import { useColorModeValue } from '@chakra-ui/react';
import { Button, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';

 const useStyles = makeStyles((theme) => ({
     root: {
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         width: '100vw',
         height: '80vh',
     },
     form_paper: {
        width: '25%',
        height: '50%',
        backgroundColor: props => props.bg,
        color: props => props.color,
        minWidth: '20rem',
        borderRadius: '80px 80px 80px 80px',
        minHeight: '25rem'
     },
     title_typo: {
        margin: '.9rem',
        color: 'inherit',
        fontWeight: '500'
     },
     currency_form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        color: 'inherit'
     },
     texfields: {
         width: '50%',
         margin: '2rem',
     },
     connect_to_wallet: {
        width: '50%',
        margin: '2rem',
        color: 'white',
        backgroundColor: 'rgb(22,111,129)',
        '&:hover':{
            color: 'white',
            backgroundColor: 'rgb(22,111,129)',
            boxShadow: '2px 2px 2px 5px rgb(22,111,129)'

        },
        borderRadius: '15px 15px 15px 15px'
     },
     select_to_network: {
         width: '50%'
     },
     textfields_label: {
         color: 'inherit'
     }
 }))


function Swap(props) {
    
    const bg = useColorModeValue('rgb(240,242,245)', 'rgb(32,32,44)')
    const color = useColorModeValue('black', 'white')
    const classes = useStyles({bg, color});

    return (
        <div className = {classes.root}>
            <Paper variant = 'outlined' className = {classes.form_paper}>
                <Typography variant = 'h5' className = {classes.title_typo}>
                    SwapIT
                </Typography>
                <form className = {classes.currency_form} onSubmit = {props.connectToWallet}>
                    <Autocomplete
                    className = {classes.select_to_network}
                    options = {props.supportedNetworks}
                    getOptionLabel = { (option) =>  option ? option.toUpperCase() : null }
                    getOptionDisabled = {(option) => option === props.supportedNetworks[props.supportedNetworks.indexOf(props.toNetwork)] ||  option === props.supportedNetworks[props.supportedNetworks.indexOf(props.currentNetwork)]  } 
                    value={props.toNetwork}
                    onChange={(event, newValue) => {
                        props.handleToNetwork(newValue);
                    }}
                    renderInput={ (params) => < TextField 
                        required = { !props.isConnectedToWallet ? false : true } 
                        {...params} label="To (Network)" margin="normal" InputLabelProps = {{
                        ...params.InputLabelProps,
                        className: classes.textfields_label
                    }}
                    InputProps = {{
                        ...params.InputProps,
                        className: classes.textfields_label
                    }} /> }
                    />
                    <TextField 
                    className = {classes.texfields}
                    label = 'Amount'
                    required = { !props.isConnectedToWallet ? false : true } 
                    color = 'secondary'
                    type = 'number'
                    value = {props.amount}
                    placeholder = {'0'}
                    onChange = {props.handleAmount}
                    InputLabelProps = {{
                        className: classes.textfields_label
                    }}
                    InputProps = {{
                        className: classes.textfields_label
                    }}
                    />
                    <Button 
                    className = {classes.connect_to_wallet}
                    type = 'submit'
                    >
                        { !props.isConnectedToWallet ? 'Connect to Metamask' : 'Swap ETH'}  
                    </Button>
                </form>
            </Paper>
        </div>
    )
}

export default Swap
