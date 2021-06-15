import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { loginAPI } from '../apis/rails-backend';
import { BrowserRouter, Route} from 'react-router-dom';
import Home from '../pages/Home.js';
import OrderAddress from '../pages/OrderAddress.js';
import SignIn from '../pages/SignIn';
import SignUpPage from '../pages/SignUpPage';

const App = () => {
    const [state, setState] = useState({
            isLoggedIn: false,
            user: '',
    });

    const handleLogin = (data) => {
        setState({
            isLoggedIn: true,
            user: data.user,
        });
    }

    const handleLogOut = () => {
        setState({
            isLoggedIn: false,
            user: '',
        })
    }

    const renderPage = () => {
        if (state.isLoggedIn) {
            return (<div><Home /></div>);
        } else {
            return (<div><SignIn handleLogin={handleLogin}/></div>);
        }
    }

    
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={SignIn}>
                        {renderPage()}
                    </Route>
                    <Route path="/signup" exact component={SignUpPage}/>
                    <Route path="/home" exact component={Home}/>
                    <Route path="/order/address" exact component={OrderAddress}/>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;