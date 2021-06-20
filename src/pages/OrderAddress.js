import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import HorizontalLabelPositionBelowStepper from '../components/HorizontalLabelPositionBelowStepper.js';
import YourAddressHeader from '../components/YourAddressHeader.js';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';

const OrderAddress = () => {
    const classes = useStyles();

    return (
        <div>
            <AppHeader/>
            {/* <Link to="/home">
                <ArrowBackIosOutlinedIcon style={{fill: "#979797"}}/>
            </Link> */}
            {/* <YourAddressHeader/> */}
            <HorizontalLabelPositionBelowStepper className={classes.overallPage}/>
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
        background: '#fffdf6',
        minHeight: '100vh',
    }, 
    box: {
        padding: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
  }));

export default OrderAddress;