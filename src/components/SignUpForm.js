import React from 'react';
import {useState} from 'react';
import {signUpAPI} from '../apis/rails-backend';
import Logo from './Logo';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';

const SignUpForm = (props) => {

    const [state, setState] = useState(
        {
            email: '',
            password: '', 
            password_confirmation: '',
            contact_no: parseInt(''),
            name: '',
        });

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
        if (input.target.value === state.password) {
            setState({...state, password_confirmation: input.target.value});
        } 
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(state);
        let user = {user: {...state}};
        console.log(user);
        console.log('posting');
        axios.post(signUpAPI, user, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(response => {
            console.log('post');
            console.log(response);
            props.handleLogin({email: state.email, password: state.password});
        }).catch(error => {
            if (error.response) {
                console.log(error.response);
            } else if (error.request) {
                console.log(error.request);
            } else if (error.message) {
                console.log(error.message);
            }
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
                    />
                </div>
                <br/>
                <div className={classes.actionCard}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        onChange={handleEmailInput}
                    />
                </div>
                <br/>
                <div className={classes.actionCard}>
                    <TextField
                        id="contact-number"
                        label="Contact Number"
                        variant="outlined"
                        onChange={handleNumberInput}
                    />
                </div>
                <br/>
                <div className={classes.actionCard}>
                    <TextField
                        id="password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        onChange={handlePasswordInput}
                        />
                </div>
                <br/>
                <div className={classes.actionCard}>
                    <TextField
                        id="password-confirmation"
                        label="Password Confirmation"
                        type="password"
                        variant="outlined"
                        onChange={handlePasswordConfirmation}
                        />
                </div>
                <br/>
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
    }
  }));

export default SignUpForm;