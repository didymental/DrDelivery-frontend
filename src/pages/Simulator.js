import React from 'react';
import MapContainer from '../components/Map';
import AppHeader from '../components/AppHeader';
import {websocketAPI} from '../apis/rails-backend';

const Simulator = (props) => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(websocketAPI + '?token=' + token);
    const drones = new Map();
    const route = new Map();
    const merchantAddresses = new Map();
    const customerAddresses = new Map();
    const chargingRoutes = new Map();

    return (<div>
        <AppHeader
            setOrder={props.setOrder}
            setState={props.setState}
            order={props.order}
            />
        <MapContainer 
            ws={ws}
            drones={drones}
            route={route}
            merchantAddresses={merchantAddresses}
            customerAddresses={customerAddresses}
            chargingRoutes={chargingRoutes}
            
            
        />
        </div>);
}

export default Simulator;