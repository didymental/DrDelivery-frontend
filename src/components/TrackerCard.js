import React from 'react';
import {useHistory} from 'react-router-dom';
import {Paper, Typography, Box, LinearProgress, Button} from '@material-ui/core';
import OrderCollectedButton from './OrderCollectedButton';
import ThankYouOrder from './ThankYouOrder';
import {makeStyles} from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const TrackerCard = (props) => {
    const status = props.status;
    const merchants = props.merchants;
    const merchantID = props.merchantID;
    const order = props.order;

    const history = useHistory();

    const classes = useStyles();

    return status === "awaiting_customer_pickup" 
        ? (
            <Paper className={classes.outerbox}>
                <Typography variant="body1">
                    <Box fontWeight="fontWeightBold" className={classes.detailsBox}>
                      {convertStatusToString(status)}
                    </Box>
                </Typography>
                <Typography variant="body1">{searchMerchantName(merchantID, merchants)}</Typography>
                <LinearProgress variant="determinate" value={getValue(convertStatusToString(status))}/>
                <Box className={classes.buttonWrapper}>
                  <OrderCollectedButton 
                    order={order}
                    setState={props.setState}
                    state={props.state}
                    orderID={order.id}
                  />
                </Box>
            </Paper>
        )
        : status !== "completed"
            ? (
                <Paper className={classes.outerbox}>
                    <Typography variant="body1">
                        <Box fontWeight="fontWeightBold" className={classes.detailsBox}>
                        {convertStatusToString(status)}
                        </Box>
                    </Typography>
                    <Typography variant="body1">{searchMerchantName(merchantID, merchants)}</Typography>
                    <LinearProgress variant="determinate" value={getValue(convertStatusToString(status))}/>
                    <Box className={classes.buttonWrapper}>
                    <Button className={classes.button} onClick={() => history.push('/orderProgress')}>
                        See Order Progress
                        <ChevronRightIcon/>
                    </Button>
                    </Box>
                </Paper>

            ) :
            null
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

function convertStatusToString(status) {
    switch(status) {
        case 'merchant_preparing': 
            return 'Merchant Preparing';

        case 'awaiting_drone_pickup':
            return 'Drone is Picking Up Your Order';

        case 'enroute_to_customer':
            return 'Drone is on the way';
            
        case 'awaiting_customer_pickup':
            return 'Your Delivery is here';

        case 'completed':
            return 'Completed';

        default: 
            return '';
    }
}

const useStyles = makeStyles((theme) => ({
    outerbox: {
      padding: theme.spacing(3),
      maxWidth: '650px',
      marginBottom: theme.spacing(2),
      //display: 'flex',
    },
    innerBox: {
      display: 'flex',
    },
    box: {
      //padding: theme.spacing(2),
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
    },
    detailsBox: {
      marginBottom: theme.spacing(1),
      display: 'flex',
      //flexDirection: 'column',
    },
    clearButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing(2.5),
      //padding: theme.spacing(0.5),
    },
    buttonClear: {
      background: '#E9E9E9',
    }
  }));

export default TrackerCard;