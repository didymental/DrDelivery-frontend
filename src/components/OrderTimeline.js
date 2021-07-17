import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import OrderCollectedButton from './OrderCollectedButton';

const OrderTimeline = (props) => {
  const pastOrders = props.pastOrders;
  const merchants = props.merchants;

  const classes = useStyles();

  function searchMerchantName(id, arr) {
    if (arr.length === 0) {
        return null;
    } else {
        let len = arr.length;
        let start = 0;
        let end = len - 1;
        
        while (start < end) {
            let mid = start + Math.floor((end - start)/2);
            if (id <= arr[mid].id) {
                end = mid;
            } else {
                start = mid + 1;
            }
        }

        return (arr[start].id === id) ? arr[start].name : null;
    }
  }

  function getValue(str) {
    switch(str) {
        case 'Merchant Preparing': 
            return 25;

        case 'Drone is Picking Up Your Order':
            return 50;

        case 'Drone is on the way':
            return 75;
            
        case 'Your Delivery is here':
            return 100;

        default: 
            return 0;
    }
}

  return (
    <Box className={classes.outerbox}>
    <Typography variant="h5">
      <Box fontWeight="bold">Your Current Orders </Box>
    </Typography>
      {
        pastOrders.map(order => {
        console.log(order);
        return order.status === "Your Delivery is here" 
        ? (
          <Paper className={classes.outerbox}>
            <Typography variant="body1">{searchMerchantName(order.merchant_id, merchants)}</Typography>
            <LinearProgress variant="determinate" value={getValue(order.status)}/>
            <Box className={classes.buttonWrapper}>
              <OrderCollectedButton orderID={order.id}/>
            </Box>
          </Paper>
        )
        : order.status === "Completed" 
          ? null
          : (
            <Paper className={classes.outerbox}>
              <Typography variant="body1">{searchMerchantName(order.merchant_id, merchants)}</Typography>
              <Box>
                <LinearProgress variant="determinate" value={getValue(order.status)}/>
              </Box>
            </Paper>
            )
          }) 
    }
  </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  outerbox: {
    padding: theme.spacing(3),
    maxWidth: '650px',
    marginBottom: theme.spacing(2),
  },
  box: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonWrapper: {
    marginTop: theme.spacing(1.25),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.25),
    background: 'linear-gradient(45deg, #FF9068 30%, #FF4b1F 90%)',
    color: 'white',
  }
}));

export default OrderTimeline;