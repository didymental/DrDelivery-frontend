import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import Home from './pages/Home.js';
import OrderAddress from './pages/OrderAddress.js';

class App extends React.Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Route path="/" exact component={Home}/>
                        <Route path="/order/address" exact component={OrderAddress}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;