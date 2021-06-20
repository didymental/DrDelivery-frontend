import React from 'react';
import {Redirect} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import OrderCard from '../components/OrderCard.js';
import AppHeader from '../components/AppHeader';
import Box from '@material-ui/core/Box';

const Home = (props) => {

    const classes = useStyles();

    const renderPage = () => {
        if (props.order.hasOrder) {
            return (<Redirect to="/order/address" />);
        }
    }


    return (
        <div className={classes.overallPage}>
            <AppHeader handleLogout={props.handleLogout}/>
            <Box className={classes.box}>
                <div className={classes.root}>
                    <Typography variant="h3"> 
                        Faster Deliveries, Lower Fees. 
                    </Typography>
                    <br/>
                    <Typography variant="overline"> 
                        Drones make your delivery. You control their speed.
                    </Typography>
                </div>
            </Box>
            <OrderCard handleOrder={(address) => props.handleOrder(address)}/> 
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
        background: '#fffdf6',
        minHeight: '100vh',
    }, 
    box: {
        padding: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
  }));

export default Home;