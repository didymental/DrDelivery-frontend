import { Map, GoogleApiWrapper } from 'google-maps-react';
import axios from 'axios';
import {websocketAPI} from '../apis/rails-backend';
import React from 'react';
// import { w3cwebsocket as W3CWebSocket } from "websocket";


const token = localStorage.getItem('token');
const userid = localStorage.getItem('userID');

// const client = new W3CWebSocket('ws://localhost:3000/api/v1/cable?token=' + token);


class MapContainer extends React.Component {
    ws = new WebSocket(websocketAPI + '?token=' + token)
    droneLat = 0
    droneLng = 0
    // outStandingOrder =
    // axios.post(loginAPI, user, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //     },
    // }).then(response => {
    //     props.handleLogin(response.data.token, response.data.user_id);
    // }).catch(error => {
    //     console.log(error.response);
    //     if (error.response) {
    //         setError({...error, hasError: true, message: error.response.data.message});
    //     }
    // });
    componentWillMount() {
        this.ws.onopen = () => {
          console.log('WebSocket Client Connected');
        };
        this.ws.onmessage = (message) => {
          console.log(message);
        //   const update = JSON.parse(message.data);
        //   console.log(update);
        //   if (update.drone != null) {

        //   }
        };

    }

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