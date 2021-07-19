import React from 'react';
import {useState, useEffect} from 'react';
import {merchantAPI, loginAPI} from '../apis/rails-backend';
import axios from 'axios';

import PastProductTable from './PastProductTable';

const PastOrdersProducts = (props) => {
    const merchantID = props.merchantID;
    
    

    const [merchantProducts, setMerchantProducts] = useState([]);

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

        const getProducts = async () => {
            const token = await getAdminToken();
            axios.get(merchantAPI + '/' + merchantID + '/products', {
              headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${token}`,
              }
            }).then(response => {
                setMerchantProducts(response.data);
            });
        };

        getProducts();

        return () => {
            active = false;
        }
    }, [])

    return (
        <PastProductTable 
            orderEntries={props.orderEntries}
            merchantProducts={merchantProducts} 

        />
    );
}


export default PastOrdersProducts;