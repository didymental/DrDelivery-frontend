import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI} from '../apis/rails-backend';
import axios from 'axios';

const PastOrders = () => {
    const savedDetails = async () => {
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userID');
        const response = await axios.get(customerAPI + '/' + userid + '/orders/', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response);
    }

    useEffect(() => {
        savedDetails();

    }, [])

    return (<div>Hello</div>);

}

export default PastOrders;