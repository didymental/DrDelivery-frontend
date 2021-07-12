import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MapContainer from '../components/Map';
import AppHeader from '../components/AppHeader';
import {websocketAPI} from '../apis/rails-backend';

const Simulator = (props) => {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userID');
    const ws = new WebSocket(websocketAPI + '?token=' + token)
    const drones = new Map();

    return (<div>
        <AppHeader
            setOrder={props.setOrder}
            setState={props.setState}
            order={props.order}
            />
        <MapContainer 
            ws={ws}
            drones={drones}
        />
        </div>);
}

export default Simulator;