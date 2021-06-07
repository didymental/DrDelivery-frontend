import React from 'react';
import {useState} from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import {makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const SignUp = () => {
    const classes = useStyles();
    return (
        <div>
            <h3 className={classes.root}>New to DrDelivery?</h3>
            
            <div className={classes.root}>
                <Link to="/signup">
                <Box className={classes.actionCard} borderRadius={15} borderColor="primary.main" bgcolor="#E1306C">
                    <Button 
                        className={classes.actionButton}
                        onClick={() => console.log('sign up')}
                    >
                    Sign Up Now!
                </Button>
                </Box>
                </Link>
            </div>

            <small className={classes.root}>Faster deliveries, lower fees</small>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(0.7),
    },
    actionCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        display: 'inline-block',
        alignItems: 'baseline',
        color: 'white',
    },
  }));

export default SignUp;