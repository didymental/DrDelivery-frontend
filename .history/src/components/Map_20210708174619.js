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
          position={{lat: drone.curr_latitude, lng: drone.curr_longitude}}
          icon={{
            url: "data:image/png;base64,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",
            anchor: new window.google.maps.Point(16,16),
            scaledSize: new window.google.maps.Size(32,32)
          }} />

        ))

        const destMarkers = arrForm.map(drone => (
        
          <Marker
          title={'The marker`s title will appear as a tooltip.'}
          name={'SOMA'}
          position={{lat: drone.dest_latitude, lng: drone.dest_longitude}} />

        ))

        const lines = arrForm.map(drone => (

        

          <Polyline
            path={crossIslandCoord}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2} />
          

        ))

        console.log(destMarkers);
        console.log(droneMarkers);
        console.log(lines);
        
        return (
          <Map google={this.props.google} zoom={12}
          initialCenter={{
            lat: 1.368635520835842,
            lng: 103.81916601690331
          }}>

            <Polyline
            path={[{lat: drone.curr_latitude,  lng: drone.curr_longitude},
              {lat: drone.dest_latitude,  lng: drone.dest_longitude}]
              
          
            }
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2} />



            {
              droneMarkers
            }

            {
              destMarkers
            }

            {     
              lines
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