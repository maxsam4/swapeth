import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: '0',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  alert: {
      justifyContent: 'center'
  }
}));

function CustomAlert({severity, message}) {
    
const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert className = {classes.alert} variant = 'filled' severity={severity}>{message}</Alert>
    </div>
  );
}

export default CustomAlert
