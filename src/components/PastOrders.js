import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI, merchantAPI, loginAPI} from '../apis/rails-backend';
import axios from 'axios';

import {makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import PastOrderCard from './PastOrderCard';

const PastOrders = () => {
    const [pastOrders, setPastOrders] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [toDisplay, setToDisplay] = useState({
        merchantName: '',
        totalPrice: parseInt(''),
        itemsOrdered: [],
        date: '',
    })

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

    // const getProducts = async (id) => {
    //     const token = await getAdminToken();
    //     axios.get(merchantAPI + '/' + id + '/products', {
    //       headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${token}`,
    //       }
    //     }).then(response => {
    //         console.log(response.data);
    //       return [...response.data];
    //     });
    // };

    // const searchProducts = (merchantID, productID) => {
    //     getProducts(merchantID);
    //     // console.log(productList);
    //     // productList.filter(elem => elem.id === productID);
    //     // return productList[0].name;

    //     return null;
    // }

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
        <Box>
            <Box className={classes.pastOrderContainer}>
                    <Typography variant="h4">
                        Past Orders
                    </Typography>
                </Box>

                <Grid
                    container
                    direction="column"
                    // justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        
                        pastOrders.map(order => {
                            console.log(order);
                            console.log(order.order_entries);
                        return (
                            <Grid
                            item 
                            key={order.id}
                            >
                                <Box>
                                    <Typography variant="h6">
                                        {searchMerchantName(order.merchant_id, merchants)}
                                    </Typography>
                                </Box>
                                <Box>
                                    {/* {order.order_entries.map(elem => searchProducts(order.merchant_id, elem.product_id))} */}
                                </Box>
                                <Box>
                                    {'Total Purchase: S$' + order.total_price}
                                </Box>
                                </Grid>
                        ) 
                        })
                    }

                </Grid>
        </Box>)
    ;

}

const useStyles = makeStyles((theme) => ({
    pastOrderContainer: {
        padding: theme.spacing(1),
    },
}));

export default PastOrders;