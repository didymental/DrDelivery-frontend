import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI, merchantAPI, loginAPI} from '../apis/rails-backend';
import axios from 'axios';
import PastOrderCard from './PastOrderCard';

import {makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';



const PastOrdersWithStatus = (props) => {
    const classes = useStyles();
    const pastOrders = props.pastOrders;
    const merchants = props.merchants;

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
                return 'Past Orders';
        }
    }

    return (
        <Box className={classes.overallWrapper}>
            <Box className={classes.pastOrderContainer}>
                    <Typography variant="h4">
                        <Box fontWeight="fontWeightBold">
                        {convertStatusToString(props.status)}
                        </Box>
                    </Typography>
                    
            </Box>
            <Divider />
            <Grid
                container
                direction="column"
                alignItems="flex-start"
                spacing={4}
                className={classes.grid}
            >
                {
                    
                    pastOrders.filter(obj => obj.status === props.status).reverse().map(order => {
                    return (
                        <Grid
                        item 
                        key={order.id}
                        >
                            <PastOrderCard 
                                merchantName={searchMerchantName(order.merchant_id, merchants)}
                                totalPrice={order.total_price.toFixed(2)}
                                date={order.updated_at}
                                merchantID={order.merchant_id}
                                orderEntries={order.order_entries}
                            />
                        </Grid>
                    ) 
                    })
                }

            </Grid>
        </Box>)
}

const useStyles = makeStyles((theme) => ({
    overallWrapper: {
        padding: theme.spacing(3),
    },
    pastOrderContainer: {
        padding: theme.spacing(1.5),
        justifyContent: 'center',
        alignItems:'center',
    },
    grid: {
        marginTop: theme.spacing(1.5),
    }
    
}));

export default PastOrdersWithStatus;