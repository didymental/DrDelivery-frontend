import React from 'react';
import {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import GoogleAuth from '../components/GoogleAuth';
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';

const SignUp = () => {
    const classes = useStyles();
    return (
        <div>
            <small className={classes.footer}>New to DrDelivery?</small>
            <Link to="/signup">
                <div className={classes.actionCard}>
                    <Button 
                        className={classes.signup}
                        onClick={() => console.log('sign up')}
                    >
                        <div className={classes.signupText}>
                            Sign Up Now
                        </div>
                    </Button>
                </div>
            </Link>
            <small className={classes.root}>Faster deliveries, lower fees</small>
        </div>
    )

}

const Login = () => {
    const [state, setState] = useState(
        {
            email: '',
            password: '', 
        });
    const classes = useStyles();

    const handleEmailInput = (input) => {
        setState({...state, email: input.target.value});
    }

    const handlePasswordInput = (input) => {
        setState({...state, password: input.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
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
                        id="standard-required"
                        label="Email"
                        variant="outlined"
                        onChange={handleEmailInput}
                    />
                </div>
                <br/>
                <div className={classes.actionCard}>
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        onChange={handlePasswordInput}
                        />
                </div>
                <br/>
                <div>
                    <Link to="/home">
                            <div className={classes.login}>
                                <Button
                                    onClick={() => console.log('submit')}
                                    type="submit">
                                        <span className={classes.loginText}>
                                            Login
                                        </span>   
                                        <PlayArrowIcon className={classes.icon}/>        
                                </Button>
                            </div>    
                        
                    </Link>
                </div>
                
            </form>
            <div className={classes.footer}>
                {SignUp()}
            </div>
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
    footer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 1em 1em 1em',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: theme.palette.grey[700],
    },
    signup: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        borderRadius: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        border: 0,
        boxShadow: '0 3px 5px 2px rgba(135, 105, 235, .3)',
        color: 'white',
        borderRadius: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: 'white',
    },
    loginText: {
        display: 'table-cell',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: 'white',
        verticalAlign: 'middle',
    },
    icon: {
        display:'table-cell',
        justifyContent: 'flex-end',
        alignItems: 'center',
        color: 'white',
        verticalAlign: 'middle',
    }
  }));
  //orderRadius={15} borderColor="primary.main" bgcolor="#E1306C"

export default Login;