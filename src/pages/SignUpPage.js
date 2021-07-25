import React from 'react';
import {makeStyles } from '@material-ui/core/styles';
import SignUpForm from '../components/SignUpForm';
import Box from '@material-ui/core/Box';

const SignUpPage = (props) => {
    const classes = useStyles();
    return (
        <Box className={classes.main}>
            <Box className={classes.form}>
                <SignUpForm handleLogin={props.handleLogin}/>
            </Box>
        </Box>
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
        minHeight: '900px',
    },
}));


export default SignUpPage;