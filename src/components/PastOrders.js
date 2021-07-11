import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI, merchantAPI, loginAPI} from '../apis/rails-backend';
import axios from 'axios';
import PastOrdersWithStatus from './PastOrdersWithStatus';
import {makeStyles } from '@material-ui/core/styles';;


const PastOrders = () => {
    const [pastOrders, setPastOrders] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [toDisplay, setToDisplay] = useState({
        merchantName: '',
        totalPrice: parseInt(''),
        itemsOrdered: [],
        date: '',
    })

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

    return (
        <PastOrdersWithStatus status="merchant_preparing" pastOrders={pastOrders} merchants={merchants}/>
    );

}

const useStyles = makeStyles((theme) => ({
    pastOrderContainer: {
        padding: theme.spacing(1),
    },
}));

export default PastOrders;