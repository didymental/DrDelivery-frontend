import React from 'react';
import {makeStyles } from '@material-ui/core/styles';
import droneBackground from '../assets/dronelol.gif';
import Login from '../components/Login';
import SignUp from '../components/SignUp';



const SignIn = () => {
    const classes = useStyles();

    return (
        <div style={{backgroundColor: "#DCDCDC"}} >
            <div style={{backgroundImage: `url(${droneBackground}`}} className={classes.root}>
                <Login/>
            </div>

            <div className={classes.root}>
                <SignUp/>
            </div>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    actionCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        display: 'inline-block',
        alignItems: 'baseline'
    },
  }));

export default SignIn;