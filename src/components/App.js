import React from 'react';
import {useState} from 'react';
import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import Home from '../pages/Home.js';
import OrderAddress from '../pages/OrderAddress.js';
import SignIn from '../pages/SignIn';
import SignUpPage from '../pages/SignUpPage';

const App = () => {
    const [state, setState] = useState({
            isLoggedIn: false,
            user: '',
    });

    const [order, setOrder] = useState({
        hasOrder: false,
    })

    const handleOrder = (address) => {
        console.log('here');
        if (address) {
            setOrder({...order, hasOrder: true});
        }
    }

    const handleLogin = (token) => {
        setState({
            isLoggedIn: true,
            user: token,
        });
        localStorage.setItem('token', token);
    }

    const handleLogOut = () => {
        setState({
            isLoggedIn: false,
            user: '',
        });
        localStorage.removeItem('token');
    }

    const renderPage = () => {
        console.log(order.hasOrder);
        if (state.isLoggedIn) {
            return (<Redirect to="/home" />);
        } else if (order.hasOrder) {
            console.log(order.hasOrder);
            return (<Redirect to="/order/address"/>);
        } else {
            return (<Redirect to="/" /> );
        }
    }

    
    return (
        <div>
            
            <BrowserRouter>
                <div>
                    {renderPage()}
                    <Route path="/" exact component={ () => <SignIn handleLogin={handleLogin}/> }/>
                    <Route path="/signup" exact component={ () => <SignUpPage handleLogin={handleLogin}/>}/>
                    <Route path="/home" exact component={ () => <Home handleLogout={handleLogOut} handleOrder={handleOrder} order={order}/> }/>
                    <Route path="/order/address" exact component={OrderAddress}/>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;