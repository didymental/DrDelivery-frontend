import { Map, GoogleApiWrapper, Marker, GoogleMapReact  } from 'google-maps-react';
// import { Wrapper } from "@googlemaps/react-wrapper";
import React from 'react';
import {websocketAPI} from '../apis/rails-backend';


const token = localStorage.getItem('token');
const userid = localStorage.getItem('userID');


// const client = new W3CWebSocket('ws://localhost:3000/api/v1/cable?token=' + token);

class MapContainer extends React.Component {
    ws = new WebSocket(websocketAPI + '?token=' + token)
    drones = []

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

            }
          }
          
        };

    }


    render() {

      const LocationPin = ({ text }) => (
        <div className="pin">
          {/* <Icon icon={locationIcon} className="pin-icon" /> */}
          <p className="pin-text">{text}</p>
        </div>
      )
        const dronesArray = [];
        const destArray = [];
        console.log(this.drones);
        this.drones.forEach( (index, value) =>
        
          {
            // console.log("writing to marker arr")
            // console.log(value)
            // console.log(index)
            dronesArray.push(<Marker lat={index.curr_latitude} lng={index.curr_longitude} text="Drone"> </Marker>)
            destArray.push(<Marker lat={index.dest_latitude} lng={index.dest_longitude} text="Destination"></Marker>)
          }

        )
        
        // console.log(dronesArray);
        // console.log(destArray);
        const location = {
          address: '1600 Amphitheatre Parkway, Mountain View, california.',
          lat: 37.42216,
          lng: -122.08427,
        };
        
        return (
        <Map 
            google={this.props.google}
            zoom={12}
            initialCenter={ {lat: 1.290270, lng: 103.851959}}>

            <Marker lat={1.5257573635755262} lng={ 103.7252810354221} text="sanity check"/>

            {/* <Marker
              lat={59.955413}
              lng={30.337844}
              text="My Marker"
            /> */}

            </Map>
        
    //     <GoogleMapReact
    //     bootstrapURLKeys={{ key: 'AIzaSyCEkczgoE41K_X4sk4maD-ju_64GB-zSj4' }}
    //     defaultCenter={location}
    //     defaultZoom={8}
    //   ></GoogleMapReact>
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