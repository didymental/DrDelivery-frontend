import React from 'react';
import Logo from '../Logo.js';
import OrderCard from '../OrderCard.js';
import SignInPage from '../SignInPage.js';


const Home = () => {
    return (
        <div>
            <SignInPage/>
            <Logo />
            <OrderCard/>  
        </div>
    );
}

export default Home;