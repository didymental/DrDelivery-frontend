import React from 'react';
import {Redirect} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import OrderCard from '../components/OrderCard.js';
import AppHeader from '../components/AppHeader';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tracker from '../components/Tracker';

const Home = (props) => {
    const matches = useMediaQuery('(min-width: 769px)');

    const classes = useStyles();

    const renderPage = () => {
        if (props.order.hasOrder) {
            return (<Redirect to="/order/address" />);
        }
    }


    return (
        <div className={matches ? classes.overallPage : classes.overallPageMobile}>
            <AppHeader 
                setOrder={props.setOrder}
                setState={props.setState}
                order={props.order}
                
            />
            
            <Box className={classes.box}>
                <div className={classes.root}>
                    <Typography variant="h3"> 
                        Faster Deliveries, Lower Fees. 
                    </Typography>
                    <br/>
                    <Typography variant="overline"> 
                        Drones make your delivery. Observe their flight. Love their speed.
                    </Typography>
                </div>
            </Box>
            <Tracker entry="home"/>
            <OrderCard 
                handleOrder={(address) => props.handleOrder(address)}
                updateAddress={(address_id) => props.updateAddress(address_id)}
                token={props.token}
                userID={props.userID}/> 
            {renderPage()}
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex-start',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(0.75),
      marginLeft: '10px'
    },
    overallPage: {
        background: '#ffffff',
        minHeight: '100vh',
        // backgroundImage: `url("https://res.cloudinary.com/didymusne/image/upload/v1625758213/droneVector_etmeia.png")`,
        backgroundImage: 'url(/assets/droneBackground.jpg)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
       
    },
    overallPageMobile: {
        background: '#ffffff',
        minHeight: '100vh',
        // backgroundImage: `url("https://res.cloudinary.com/didymusne/image/upload/v1625758213/droneVector_etmeia.png")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    box: {
        padding: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
  }))
  
  ;

export default Home;