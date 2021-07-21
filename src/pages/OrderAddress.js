import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppHeader from '../components/AppHeader';
import HorizontalLabelPositionBelowStepper from '../components/HorizontalLabelPositionBelowStepper.js';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const OrderAddress = (props) => {
    const classes = useStyles();
    const matches = useMediaQuery('(min-width: 768px)');

    return (
        <div className={matches ? classes.overallPage : classes.overallPageMobile}>
            <AppHeader 
                setOrder={props.setOrder}
                setState={props.setState}
                order={props.order}
                
                />
            <HorizontalLabelPositionBelowStepper 
                className={classes.overallPage} 
                dropOffAdd={props.dropOffAdd}
                setOrder={props.setOrder}
            />
        </div>
    )
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
        backgroundImage: 'url(/assets/droneBackground.jpg)',
        // backgroundImage: `url("https://res.cloudinary.com/didymusne/image/upload/v1625760180/orderMerchants_1_howza1.png")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    }, 
    overallPageMobile: {
        background: '#ffffff',
        minHeight: '100vh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    }, 
    box: {
        padding: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
  }));

export default OrderAddress;