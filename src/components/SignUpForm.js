import React from 'react';
import {useState} from 'react';
import {customerAPI} from '../apis/rails-backend';
import Logo from './Logo';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SignUpForm = (props) => {

    const [state, setState] = useState(
        {
            name: '',
            contact_no: parseInt(''),
            email: '',
            password: '', 
            password_confirmation: '',
            
            
        });
    
    const [signupSuccess,setSignUpSuccess] = useState(false);
    const [signupFail, setSignUpFail] = useState({
        message: [],
        fail: false,
    });
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const handleNameInput = (input) => {
        setState({...state, name: input.target.value});
    };

    const handleEmailInput = (input) => {
        setState({...state, email: input.target.value});
    };

    const handleNumberInput = (input) => {
        setState({...state, contact_no: input.target.value});
    };

    const handlePasswordInput = (input) => {
        setState({...state, password: input.target.value});
    }

    const handlePasswordConfirmation = (input) => {
        setState({...state, password_confirmation: input.target.value}); 
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        let user = {...state};
        axios.post(customerAPI, user, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(response => {
            setSignUpSuccess(true);
            // props.handleLogin({email: state.email, password: state.password}, response.data.user_id);
            setLoading(false);
        }).catch(error => {
            if (error.response) {
                if (error.response.data.message === undefined) {
                    setSignUpFail({...signupFail, message: error.response.data, fail: true});
                } else {
                    setSignUpFail({...signupFail, message: error.response.data.message, fail: true});
                }
                
            } 
            setLoading(false);
        });
        
    }

    return (
        <div>
            <Box bgcolor="#FFFFFF" borderRadius={10}>
            <Logo color='black'/>
            <form className={classes.root} onSubmit={handleSubmit}>
                <div className={classes.actionCard}>
                    <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        onChange={handleNameInput}
                        error={signupFail.message.reduce((acc, curr) => acc + curr, '').includes("Name")}
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        onChange={handleEmailInput}
                        error={signupFail.message.reduce((acc, curr) => acc + curr, '').includes("Email")}
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="contact-number"
                        label="Contact Number"
                        variant="outlined"
                        onChange={handleNumberInput}
                        error={signupFail.message.reduce((acc, curr) => acc + curr, '').includes("Contact")}
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        onChange={handlePasswordInput}
                        error={signupFail.message.reduce((acc, curr) => acc + curr, '').includes("Password")}
                        />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="password-confirmation"
                        label="Password Confirmation"
                        type="password"
                        variant="outlined"
                        onChange={handlePasswordConfirmation}
                        error={signupFail.message.reduce((acc, curr) => acc + curr, '').includes("Password")}
                        />
                </div>
                
                <div className={classes.actionButton}>
                        <Button
                            className={classes.signup}
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            type="submit">
                            Sign Up
                        </Button>
                        <Link to="/">
                        <Button variant="contained" style={ {margin: '5px'}}>
                            Cancel
                        </Button>
                        </Link>
                </div>
            </form>
            <br/>
            <Snackbar open={signupSuccess}>
                <Alert severity="info">
                    <AlertTitle>Authentication Needed</AlertTitle>
                    We have sent an authentication email to your email address. Once you have confirmed your email, you may login. 
                </Alert>
            </Snackbar>
            <Snackbar open={signupFail.fail}>
                <Alert severity="error" onClose={() => setSignUpFail({...state, message: []})}>
                    <AlertTitle>Error</AlertTitle>
                    {signupFail.message.map(err =>  err + '. \n')}
                </Alert>
            </Snackbar>
            <Box className={classes.loadingWrapper}>
            {loading ? <CircularProgress className={classes.loading} size={20}/> : null}
            </Box>
            </Box>
        </div>
    )
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
        marginBottom: theme.spacing(1.5),
    },
    actionButton: {
        display: 'inline-block',
        alignItems: 'baseline'
    },
    signup: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        borderRadius: 10,
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        color: 'grey',
        marginBottom: theme.spacing(2),
    },
    loadingWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
  }));

export default SignUpForm;