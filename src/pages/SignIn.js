import React from 'react';
import Logo from '../components/Logo';
import {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles } from '@material-ui/core/styles';
import GoogleAuth from '../components/GoogleAuth';
import {Link} from 'react-router-dom';


const SignIn = () => {
    const [state, setState] = useState(
        {
            email: '',
            password: '', 
        });
    const classes = useStyles();

    return (
        <div>
            <h1 className={classes.root}>
                Welcome to Dr Delivery
            </h1>
            <form className={classes.root}>
                <div className={classes.actionCard}>
                    <TextField
                        id="standard-required"
                        label="Email"
                        variant="outlined"
                        onChange={(input)=>console.log(input.target.value)}
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
                        onChange={(input)=> console.log(input.target.value)}
                        />
                </div>
                <br/>
                <div className={classes.actionButton}>
                    <Link to="/home">
                        <Button 
                            onClick={() => console.log('submit')}
                            variant="contained"
                            color="primary"
                            type="submit">
                            Login
                        </Button>
                    </Link>
            
                    <Button variant="contained" style={ {margin: '5px'}}>
                        Cancel
                    </Button>
                    
                </div>
            </form>
            
            <div className={classes.actionCard}>
                <GoogleAuth/>
            </div>
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
    }
  }));

export default SignIn;