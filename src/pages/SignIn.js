import React from 'react';
import {makeStyles } from '@material-ui/core/styles';
import Login from '../components/Login';

const SignIn = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.main}>
            <div className={classes.form}>
                <Login handleLogin={props.handleLogin}/>
            </div>
        </div>
        
    );
}

const useStyles = makeStyles((theme) => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: `url(https://cdn.mos.cms.futurecdn.net/DGyKoxRLtJmrijCxEcLmea-1366-80.jpg.webp)`,
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
    },
    form: {
        marginTop: '6em',
        padding: '0 1em 1em 1em',
    },
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