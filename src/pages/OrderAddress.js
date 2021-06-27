import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppHeader from '../components/AppHeader';
import HorizontalLabelPositionBelowStepper from '../components/HorizontalLabelPositionBelowStepper.js';

const OrderAddress = (props) => {
    const classes = useStyles();

    return (
        <div>
            <AppHeader handleLogout={props.handleLogout}/>
            <HorizontalLabelPositionBelowStepper 
                className={classes.overallPage} 
                dropOffAdd={props.dropOffAdd}
                setOrder={props.setOrder}/>
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