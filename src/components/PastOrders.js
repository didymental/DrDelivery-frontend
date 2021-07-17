import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI, merchantAPI, loginAPI} from '../apis/rails-backend';
import {makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import PastOrdersWithStatus from './PastOrdersWithStatus';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const PastOrders = () => {
    const [pastOrders, setPastOrders] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAdminToken = async () => {
        const adminLogin = {
          email: 'example@railstutorial.org',
          password: 'foobar'
        };
    
        const response = await axios.post(loginAPI, adminLogin, {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
        });
        return response.data.token;
    };

    useEffect(() => {
        let active = true;

        const getPastOrders = async () => {
            const token = localStorage.getItem('token');
            const userid = localStorage.getItem('userID');
            const orderResponse = await axios.get(customerAPI + '/' + userid + '/orders/', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (active) {
                setPastOrders([...orderResponse.data])
            }
        }

        const getMerchants = async () => {
            const token = await getAdminToken();
            axios.get(merchantAPI, {
              headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${token}`,
              }
            }).then(response => {
              let merchantList = [...response.data];
              setLoading(false);
              setMerchants(merchantList);
            });
        };

        getPastOrders();
        getMerchants();

        return () => {
            active = false;
        }
    }, [])

    const classes = useStyles();
    

    return loading 
    ? (<Box className={classes.loading}>
        <CircularProgress size ={40} className={classes.loadingItem}/>
        </Box>)
    : pastOrders.length === 0 
        ? <Box className={classes.overallWrapper}>
            <Box className={classes.pastOrderContainer}>
                    <Typography variant="h4">
                        <Box fontWeight="fontWeightBold">
                            You have not made an order. Make an order now! 
                        </Box>
                    </Typography>
            </Box>
        </Box>
        : (
        <div>
            <PastOrdersWithStatus status={pastOrders.filter(obj => obj.status === "awaiting_customer_pickup").length > 0 
                ? "awaiting_customer_pickup"
                : "" } 
                pastOrders={pastOrders.filter(obj => obj.status === "awaiting_customer_pickup")} 
                merchants={merchants}/>
            <PastOrdersWithStatus status={pastOrders.filter(obj => obj.status === "merchant_preparing").length > 0 
                ? "merchant_preparing"
                : "" } 
                pastOrders={pastOrders.filter(obj => obj.status === "awaiting_drone_pickup")} 
                merchants={merchants}/>
            <PastOrdersWithStatus status={pastOrders.filter(obj => obj.status === "awaiting_drone_pickup").length > 0 
                ? "awaiting_drone_pickup"
                : "" } 
                pastOrders={pastOrders.filter(obj => obj.status === "awaiting_drone_pickup")} 
                merchants={merchants}/>
            <PastOrdersWithStatus status={pastOrders.filter(obj => obj.status === "enroute_to_customer").length > 0 
                ? "enroute_to_customer"
                : "" } 
                pastOrders={pastOrders.filter(obj => obj.status === "enroute_to_customer")} 
                merchants={merchants}/>      
            
            <PastOrdersWithStatus status={pastOrders.filter(obj => obj.status === "completed").length > 0 
                ? "completed"
                : "" } 
                pastOrders={pastOrders.filter(obj => obj.status === "completed")} 
                merchants={merchants}/>       

        </div>
            

    );

}

const useStyles = makeStyles((theme) => ({
    overallWrapper: {
        padding: theme.spacing(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    pastOrderContainer: {
        padding: theme.spacing(1.5),
        justifyContent: 'center',
        alignItems:'center',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        padding: theme.spacing(3),
    },
    loadingItem: {
        color: '#FF9E55',
    }
    
}));

export default PastOrders;