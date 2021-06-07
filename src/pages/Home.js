import React from 'react';
import {useState} from 'react';
import Logo from '../components/Logo.js';
import OrderCard from '../components/OrderCard.js';
import SignInPage from '../components/SignInPage.js';
import AppBar from '@material-ui/core/AppBar';

const Home = () => {
    return (
        <div>
            <AppBar>Sign Out details</AppBar>
            <Logo/>
            
            <hr></hr>
            <OrderCard/> 
        </div>
    );
}

export default Home;