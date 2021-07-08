import { Map, GoogleApiWrapper } from 'google-maps-react';
import {websocketAPI} from '../apis/rails-backend';
import React from 'react';

const token = localStorage.getItem('token');
const userID = localStorage.getItem('userID');

class MapContainer extends React.Component {
    ws = new WebSocket(websocketAPI + '?token=' + token);
    drones = {}; // drone cache, 

    render() {
        return (<Map 
            google={this.props.google}
            zoom={12}
            initialCenter={ {lat: 1.290270, lng: 103.851959}}
            />);
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCEkczgoE41K_X4sk4maD-ju_64GB-zSj4'
})(MapContainer);