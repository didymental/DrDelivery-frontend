import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {loginAPI} from '../apis/rails-backend';
import Logo from './Logo';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SignUp = () => {
    const classes = useStyles();
    return (
        <div>
            <small className={classes.footer}>New to DrDelivery?</small>
            <Link to="/signup">
                <div className={classes.actionCard}>
                    <Button 
                        className={classes.signup}
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

const Login = (props) => {
    const [state, setState] = useState(
        {
            email: '',
            password: '', 
        });
    const classes = useStyles();

    const [error, setError] = useState({
        hasError: false,
        message: '',
    });

    const handleEmailInput = (input) => {
        setState({...state, email: input.target.value});
    }

    const handlePasswordInput = (input) => {
        setState({...state, password: input.target.value});
    }

    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        let user = {...state};
        axios.post(loginAPI, user, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(response => {
            props.handleLogin(response.data.token, response.data.user_id);
            history.push("/home");

        }).catch(error => {
            if (error.response) {
                setError({...error, hasError: true, message: error.response.data.message});
            }
        });
        setState({...state, email: '', password: ''});
    }

    return (
        <div>
            <Box bgcolor="#FFFFFF" borderRadius={10}>
                <Logo color='black'/>
                <form className={classes.root} onSubmit={handleSubmit}>
                
                    <Container className={classes.actionCard}>
                        <TextField
                            id="standard-required"
                            label="Email"
                            variant="outlined"
                            onChange={handleEmailInput}
                            error={error.hasError}
                            helperText={error.message}
                        />
                    </Container>
                    
                    <Container className={classes.actionCard}>
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            onChange={handlePasswordInput}
                            />
                    </Container>
                    
                    <Box className={classes.loginWrapper}>
                        <Box className={classes.login}>
                            <Button
                                type="submit">
                                    <span className={classes.loginText}>
                                        Login
                                    </span>   
                                    <PlayArrowIcon className={classes.icon}/>        
                            </Button>
                        </Box>    
                    </Box>
                </form>
                {/* <Snackbar open={error.hasError}>
                    <Alert severity="error" onClose={() => setError({...state, hasError: false, message: ''})}>
                        <AlertTitle>Error</AlertTitle>
                        {error.message}
                    </Alert>
                </Snackbar> */}

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
        padding: theme.spacing(1),
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
    loginWrapper: {
        padding: theme.spacing(0.5)
    },
    login: {
        // 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
        background: 'linear-gradient(315deg, #537895 0%, #09203f 74%)',
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