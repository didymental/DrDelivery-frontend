import React from 'react';
import {useState, useEffect} from 'react';
import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import Home from '../pages/Home.js';
import OrderAddress from '../pages/OrderAddress.js';
import SignIn from '../pages/SignIn';
import SignUpPage from '../pages/SignUpPage';
import Profile from '../components/Profile';

const App = () => {
    
    const [state, setState] = useState({
            isLoggedIn: false,
            user: '',
            userID: '',
    });

    const [order, setOrder] = useState({
        hasOrder: false,
    })

    const [dropOffAddress, setDropOffAddress] = useState();

    const updateAddress = (address_id) => {
        setDropOffAddress(address_id);
    }

    const handleOrder = (address, merchant_addressID) => {
        if (address) {
            setOrder({...order, hasOrder: true, merchant_addressID: merchant_addressID});
        }
    }
    
    const handleLogin = (token, user_id) => {
        localStorage.setItem('userID', user_id);
        localStorage.setItem('token', token);
        setState({
            isLoggedIn: true,
            user: token,
            userID: user_id,
        });
    }


    const renderPage = () => {
        console.log(state.isLoggedIn);
        console.log(order.hasOrder);
    }


    useEffect(() => {
        if (!state.isLoggedIn) {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('userID');
            if (token) {
                handleLogin(token, id);
            }
        }
    }, [state])
    
    return (
        <div>
            <BrowserRouter>
                <div>
                    {renderPage()}
                    <Route path="/" exact component={ () => <SignIn handleLogin={handleLogin}/> }/>
                    <Route path="/signup" exact component={ () => <SignUpPage handleLogin={handleLogin}/>}/>
                    <Route path="/home" exact component={ () => <Home 
                        // handleLogout={handleLogOut} 
                        handleOrder={handleOrder} 
                        order={order}
                        updateAddress={updateAddress}
                        setOrder={setOrder}
                        setState={setState}
                        order={order}
                        /> }
                        token={state.user}
                        userID={state.userID}
                    />
                    <Route path="/order/address" exact component={ () => <OrderAddress 
                        //handleLogout={handleLogOut}
                        dropOffAdd={dropOffAddress}
                        setOrder={setOrder}
                        setState={setState}
                        order={order}
                        /> }
                    />
                    <Route path="/profile" exact component={() => 
                        <Profile 
                            //handleLogout={handleLogOut}
                            setOrder={setOrder}
                        />}/>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;