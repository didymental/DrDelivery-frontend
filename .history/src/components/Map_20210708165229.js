import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline  } from 'google-maps-react';
// import { Wrapper } from "@googlemaps/react-wrapper";
import React from 'react';
import {websocketAPI} from '../apis/rails-backend';


const token = localStorage.getItem('token');
const userid = localStorage.getItem('userID');


// const client = new W3CWebSocket('ws://localhost:3000/api/v1/cable?token=' + token);

class MapContainer extends React.Component {
    
    ws = new WebSocket(websocketAPI + '?token=' + token)
    drones = {}


    componentWillMount() {
        this.ws.onopen = () => {
          console.log('WebSocket Client Connected');
          this.ws.send(JSON.stringify({"command":"subscribe","identifier":"{\"channel\":\"DroneChannel\"}"}));
          this.ws.send(JSON.stringify({"command":"message","identifier":"{\"channel\":\"DroneChannel\"}", "data":"{\"action\": \"request\"}"}));
        };
        this.ws.onmessage = (message) => {
          // console.log(message);
          const update = JSON.parse(message.data);
          // console.log(update);
          if (update.type != "ping") {
            const data = JSON.parse(update.message);
            // console.log(data);
            
            
            if (data.drone != null && data.drone_curr_address != null && data.drone_destination_address != null) {
                var drone = {};
                drone.id =  data.drone.id;
                drone.curr_latitude = data.drone_curr_address.latitude;
                drone.curr_longitude = data.drone_curr_address.longitude;
                // console.log(data.drone_curr_address);
                drone.dest_latitude = data.drone_destination_address.latitude;
                drone.dest_longitude = data.drone_destination_address.longitude;
                this.drones[drone.id]=drone;
                // console.log(data.drone_destination_address);
                // console.log(data.drone_curr_address);
                // console.log(data.drone_destination_address);
                this.drones[drone.id] = drone
                console.log(this.drones)

            }
          }
          
        };

    }


    render() {

        // console.log(this.drones);
  
        
        // console.log(dronesArray);
        // console.log(destArray);

        const triangleCoords = [
          {lat: 25.774, lng: -80.190},
          {lat: 18.466, lng: -66.118},
          {lat: 32.321, lng: -64.757},
          {lat: 25.774, lng: -80.190}
        ];

        const crossIslandCoords = [
          {lat: 1.3620840130644598,  lng: 103.98977274957653},
          {lat: 1.3155814794529335,  lng: 103.6265150404711}
        ];


        const samePoint = [
          {lat: 1.4075977748431727,  lng: 103.79230717260913},
          {lat: 1.4075977748431727,  lng: 103.79230717260913}
        ];
        const arrForm = Object.values(this.drones);
        console.log(this.drones);
        console.log(arrForm);
        const droneMarkers = arrForm.map(drone => (
          <Marker
            title={'The marker`s title will appear as a tooltip.'}
            name={'SOMA'}
            position={{lat: drone.curr_latitude, lng: drone.curr_longitude}} />
          ))
        
        console.log(droneMarkers);
        
        return (
          <Map google={this.props.google} zoom={12}
          initialCenter={{
            lat: 1.368635520835842,
            lng: 103.81916601690331
          }}>

            <Polyline
            path={triangleCoords}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2} />

            <Polyline
            path={samePoint}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={20} />

            <Polyline
            path={crossIslandCoords}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2} />


            {
              droneMarkers
            }



      

            
              
              
            

          </Map>
        

            );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCEkczgoE41K_X4sk4maD-ju_64GB-zSj4'
})(MapContainer);

// import { Map, GoogleApiWrapper } from 'google-maps-react';
// import axios from 'axios';
// import {websocketAPI} from '../apis/rails-backend';
// import React from 'react';
// // import { w3cwebsocket as W3CWebSocket } from "websocket";


// const token = localStorage.getItem('token');
// const userid = localStorage.getItem('userID');

// const client = new W3CWebSocket('ws://localhost:3000/api/v1/cable?token=' + token);


// class MapContainer extends React.Component {
//     ws = new WebSocket(websocketAPI + '?token=' + token)
//     droneLat = 0
//     droneLng = 0
//     // outStandingOrder =
//     // axios.post(loginAPI, user, {
//     //     headers: {
//     //         'Content-Type': 'application/json',
//     //         'Accept': 'application/json',
//     //     },
//     // }).then(response => {
//     //     props.handleLogin(response.data.token, response.data.user_id);
//     // }).catch(error => {
//     //     console.log(error.response);
//     //     if (error.response) {
//     //         setError({...error, hasError: true, message: error.response.data.message});
//     //     }
//     // });
//     componentWillMount() {
//         this.ws.onopen = () => {
//           console.log('WebSocket Client Connected');
//         };
//         this.ws.onmessage = (message) => {
//           console.log(message);
//         //   const update = JSON.parse(message.data);
//         //   console.log(update);
//         //   if (update.drone != null) {

//         //   }
//         };

//     }

//     render() {
//         return (<Map 
//             google={this.props.google}
//             zoom={12}
//             initialCenter={ {lat: 1.290270, lng: 103.851959}}
//             />);
//     }
// }

// export default GoogleApiWrapper({
//     apiKey: 'AIzaSyCEkczgoE41K_X4sk4maD-ju_64GB-zSj4'
// })(MapContainer);