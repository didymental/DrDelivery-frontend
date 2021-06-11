import React from 'react';
import Logo from '../components/Logo.js';
import OrderCard from '../components/OrderCard.js';

const Home = () => {
    return (
        <div>
            <Logo/>
            <hr></hr>
            <OrderCard/> 
        </div>
    );
}

export default Home;