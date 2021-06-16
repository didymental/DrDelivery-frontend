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
        if (state.isLoggedIn) {
            return (<Redirect to="/home" />);
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
                    <Route path="/signup" exact component={SignUpPage}/>
                    <Route path="/home" exact component={ () => <Home handleLogout={handleLogOut}/> }/>
                    <Route path="/order/address" exact component={OrderAddress}/>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;