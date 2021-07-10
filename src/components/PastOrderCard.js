import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI, merchantAPI, loginAPI} from '../apis/rails-backend';
import axios from 'axios';

import {makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const PastOrderCard = (props) => {
    const [merchantOrdered, setMerchantOrdered] = useState([]);
    const [products, setProducts] = useState([]);

    function searchMerchantName(id, arr) {
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

        if (arr[start] === id) {
            console.log('chosen: ' + arr[start].name);
            setMerchantOrdered([...merchantOrdered, arr[start]]);
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
        

    }, [])

    return (
        <div>
            hello
        </div>
    )
}

export default PastOrderCard;