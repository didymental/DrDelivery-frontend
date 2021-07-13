import React from 'react';
import {Redirect, useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Logo from '../components/Logo';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

const AccountActivated = (props) => {

    const history = useHistory();
    const classes = useStyles();
    
    const handleLogin = () => {
        history.push("/");
    }
    
    return props.isLoggedIn 
        ? <Redirect to="/home"/>
        : (
            <div className={classes.overallPage}>
                <Box >
                    <Container className={classes.logoPosition}>
                        <Logo color="black" width="200"/>
                    </Container>
                    <Box className={classes.messageWrapper} display={{sm: 'block', md: 'flex'}}>
                        <Typography variant="h5" className={classes.messageText}>
                            <Box className={classes.messagePosition}>
                            {'🎉 Your Account has been '}
                            </Box>
                            <Box  className={classes.messageSuccess}>
                                {' successfully activated 🎉'}
                            </Box>
                        </Typography>   
                    </Box>
                    
                    <Box className={classes.buttonWrapper}>
                        <Button className={classes.button} onClick={handleLogin}>
                            Go To Login
                        </Button>
                    </Box>
                </Box>
            </div>
            
        )
}

const useStyles = makeStyles((theme) => ({
    overallPage: {
        background: '#fffdf6',
        minHeight: '100vh',
        backgroundImage: `url("https://res.cloudinary.com/didymusne/image/upload/v1626191975/accountSuccess_3_hrmspf.png")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    logoPosition: {
        //margin: 'auto',
    },
    messagePosition: {
        //margin: 'auto',
        display: 'inline',
    },
    messageSuccess: {
        display: 'inline',
        color: '#1AA260',
    },
    messageWrapper: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(0.5),
        padding: theme.spacing(2),
    },
    button: {
        padding: theme.spacing(1),
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FF5C6D',
        color: 'white',
    },
    buttonWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(10),
    }
  }));

export default AccountActivated;