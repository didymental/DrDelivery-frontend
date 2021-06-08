import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';

const SignUpForm = () => {

    const [state, setState] = useState(
        {
            name: '',
            email: '',
            contactNumber: parseInt(''),
            password: '', 
            passwordConfirm: false,
            passwordCounter: 0,
        });

    const classes = useStyles();

    const handleNameInput = (input) => {
        setState({...state, name: input.target.value});
    };

    const handleEmailInput = (input) => {
        setState({...state, email: input.target.value});
    };

    const handleNumberInput = (input) => {
        setState({...state, contactNumber: input.target.value});
    };

    const handlePasswordInput = (input) => {
        setState({...state, password: input.target.value});
    }

    const handlePasswordConfirmation = (input) => {
        return input.target.value === state.password;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('submit');
    }

    


    return (
        <div>
            <Box bgcolor="#FFFFFF" borderRadius={10}>
            
            <h2 className={classes.root}>
                Welcome to Dr Delivery
            </h2>
            <form className={classes.root}>
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
                        onChange={(input)=>console.log(input.target.value)}
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
                        onChange={(input)=> console.log(input.target.value)}
                        />
                </div>
                <br/>
                <div className={classes.actionButton}>
                    <Link to="/home">
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            type="submit">
                            Sign Up
                        </Button>
                    </Link>
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
  }));

export default SignUpForm;