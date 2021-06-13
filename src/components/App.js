import React from 'react';
import axios from 'axios';
import { userAPI } from '../apis/rails-backend';
import { BrowserRouter, Route} from 'react-router-dom';
import Home from '../pages/Home.js';
import OrderAddress from '../pages/OrderAddress.js';
import SignIn from '../pages/SignIn';
import SignUpPage from '../pages/SignUpPage';
import AppHeader from './AppHeader';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            user: {},
        };
    };

    handleLogin = (data) => {
        this.setState({
            isLoggedIn: true,
            user: data.user,
        });
    }

    handleLogOut = () => {
        this.setState({
            isLoggedIn: false,
            user: {},
        })
    }

    loginStatus = () => {
        axios.get(userAPI, 
            { headers: {
                'Access-Control-Allow-Origin': '*',
            }}).then(
            response => {
                console.log(response);
            }
        )
    }

    componentDidMount() {
        this.loginStatus();
    }

    haveAppHeader = () => {
        if (this.state.isLoggedIn) {
            return (
                <AppHeader/>
            );
        }
    }


    render() {
        return (
            <div>
                {this.haveAppHeader()}
                <BrowserRouter>
                    <div>
                        <Route path="/" exact component={SignIn}/>
                        <Route path="/signup" exact component={SignUpPage}/>
                        <Route path="/home" exact component={Home}/>
                        <Route path="/order/address" exact component={OrderAddress}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;