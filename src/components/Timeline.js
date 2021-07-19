import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI, merchantAPI, loginAPI} from '../apis/rails-backend';
import axios from 'axios';

import OrderTimeline from './OrderTimeline';

const Timeline = (props) => {
    const [pastOrders, setPastOrders] = useState([]);
    const [merchants, setMerchants] = useState([]);

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

        if (pastOrders.length !== 0 && pastOrders.filter(obj => obj.status !== 'completed').length === 0) { // if there are no orders in progress

        } else {
            
            getPastOrders();
            getMerchants();
        }

        return () => {
            active = false;
        }
    }, [])

    function mapper(obj) {
        return {...obj, status: convertStatusToString(obj.status)};
    }

    return (
        pastOrders.filter(obj => obj.status !== 'completed').length === 0 
        ? null
        : 
        (<OrderTimeline  
            pastOrders={pastOrders.map(obj => mapper(obj))} 
            merchants={merchants}
            setPastOrders={setPastOrders}
            />)
    )
}

export default Timeline;
