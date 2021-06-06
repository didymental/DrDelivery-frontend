import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import Home from '../pages/Home.js';
import OrderAddress from '../pages/OrderAddress.js';
import SignIn from '../pages/SignIn';

class App extends React.Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Route path="/" exact component={SignIn}/>
                        <Route path="/home" exact component={Home}/>
                        <Route path="/order/address" exact component={OrderAddress}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;