import React from 'react';
import {makeStyles } from '@material-ui/core/styles';
import SignUpForm from '../components/SignUpForm';

const SignUpPage = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.main}>
            <div className={classes.form}>
                <SignUpForm handleLogin={props.handleLogin}/>
            </div>
        </div>
    )
};



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
        marginTop: '2em',
        padding: '0 1em 1em 1em',
    },
}));


export default SignUpPage;