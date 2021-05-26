import React from 'react';
import Logo from './Logo.js';
import OrderCard from './OrderCard.js';

const Greeting = () => {
    return (
        <div> 
            <h2 className="greeting">Hey Yuxin,</h2>
        </div>
    );
}

const App = () => {
    return (
        <div>
            <Logo/>
            <Greeting/>
            <OrderCard/>
        </div>
    );
}

export default App;