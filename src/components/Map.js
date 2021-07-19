import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline  } from 'google-maps-react';
import axios from 'axios';
import {loginAPI, customerAPI, merchantAPI} from '../apis/rails-backend';
import React from 'react';
import {useState, useEffect} from 'react';

const getAdminToken = async () => {
  const adminLogin = {
    email: 'example@railstutorial.org',
    password: 'foobar'
  };

  const response = await axios.post(loginAPI, adminLogin, {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
  });
  return response.data.token;
}

const getCustAddress = async (f, addressID) => {
  const token = localStorage.getItem('token');
  axios.get(customerAPI + '/' + localStorage.getItem('userID') + '/addresses' + '/' + addressID, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
  }).then(response => {
    console.log(response);
    f(response.data);
  });
}

const getMerchantAddress = async (f, merchantID, addressID) => {
  const token = await getAdminToken();

  axios.get(merchantAPI + '/' + merchantID + '/addresses' + '/' + addressID, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
  }).then(response => {
    console.log(response);
    f(response.data);
  })
}

const MapContainer = (props) => {
  const [state, setState] = useState({
    drones: props.drones,
    ws: null,
    disconnected: true,
  });

  const [route, setRoute] = useState(props.route);
  const [chargingRoutes, setChargingRoutes] = useState([]);
  const [merchantAddress, setMerchantAddress] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);
  //const [data, setData] = useState({});

  function immutableUpdate(arr, newDrone, i) {
    return arr.map((item, index) => i === index ? newDrone: item );
  }


  const openEventListener = (event) => {
    props.ws.send(JSON.stringify({
      "command":"subscribe",
      "identifier":"{\"channel\":\"DroneChannel\"}"
    }));

    
    props.ws.send(JSON.stringify({
      "command":"message",
      "identifier":"{\"channel\":\"DroneChannel\"}", 
      "data":"{\"action\": \"request\"}"
    }));

    props.ws.send(JSON.stringify({
      "command":"subscribe",
      "identifier":"{\"channel\":\"OrderChannel\"}"
    }));

    props.ws.send(JSON.stringify({
      "command":"message",
      "identifier":"{\"channel\":\"OrderChannel\"}", 
      "data":"{\"action\": \"request\"}"
    }));

    setState({...state, ws: props.ws, disconnected: false});
  }

  const incomingMessageListener = (message) => {
    let messageData = JSON.parse(message.data);
    if (messageData.type !== "ping") {
      let data = {};
      if (messageData.message != null) {
        console.log(messageData.message);
        console.log(data);
        data = JSON.parse(messageData.message);
        
      }

      if (data.drone_curr_address !== undefined && data.drone_curr_address != null) { // if update from Drone Channel
        console.log('taking from Drone Channel');
        let drone = {
          id: data.drone.id,
          currLatitude: data.drone_curr_address.latitude,
          currLongitude: data.drone_curr_address.longitude,
        }
        setState({...state, drones: state.drones.set(drone.id, drone)});

        const droneLocation = { 
          latitude: data.drone_curr_address.latitude,
          longitude: data.drone_curr_address.longitude,
        }

        const stationsVisibleToUser = data.drone_address_route.slice(0, data.drone_address_route.length - 1);

        setRoute(route.set(data.drone.id, [droneLocation, ...stationsVisibleToUser]));

        setChargingRoutes(stationsVisibleToUser.filter(obj => obj.addressable_type === "Station"));
      } 
      
      if (data.order_curr_address != null && data.order.drone_id != null) { // if update from Order Channel
        console.log('taking from Order Channel');
        getCustAddress(setCustomerAddress, data.order.drop_off_address_id);
        getMerchantAddress(setMerchantAddress, data.order.merchant_id, data.order.pick_up_address_id);

      }

      
    }
  }

  const closeSocket = (event) => {
    console.log("Disconnected from WS");
    setState({...state, disconnected: true});
  }

  useEffect(() => {
    props.ws.addEventListener('message', incomingMessageListener);
    props.ws.addEventListener('close', closeSocket);
    //props.ws.addEventListener('open', openEventListener);

    props.ws.onopen = () => {
      props.ws.send(JSON.stringify({
        "command":"subscribe",
        "identifier":"{\"channel\":\"DroneChannel\"}"
      }));
  
      
      props.ws.send(JSON.stringify({
        "command":"message",
        "identifier":"{\"channel\":\"DroneChannel\"}", 
        "data":"{\"action\": \"request\"}"
      }));
  
      props.ws.send(JSON.stringify({
        "command":"subscribe",
        "identifier":"{\"channel\":\"OrderChannel\"}"
      }));
  
      props.ws.send(JSON.stringify({
        "command":"message",
        "identifier":"{\"channel\":\"OrderChannel\"}", 
        "data":"{\"action\": \"request\"}"
      }));
  
      setState({...state, ws: props.ws, disconnected: false});
    }

    return () => {
      props.ws.close();
    }
  }, []);

  // const crossIslandCoords = [
  //   {lat: 1.3620840130644598,  lng: 103.98977274957653},
  //   {lat: 1.3155814794529335,  lng: 103.6265150404711}
  // ];

  const arrForm = Array.from(state.drones, (([drone_id, drone]) => ({drone_id, drone})));

  const droneMarkers = arrForm.map(obj => (
    <Marker
    title={'Your order is being delivered by Drone ' + obj.drone.id}
    name={'Drone'}
    position={{lat: obj.drone.currLatitude, lng: obj.drone.currLongitude}}
    icon={{
      url: "https://res.cloudinary.com/didymusne/image/upload/v1626512005/droneMarker_bclqa7.png",
      anchor: new window.google.maps.Point(16,16),
      scaledSize: new window.google.maps.Size(32,32)
    }} />

  ))

  // const chargingStations = Array.from(chargingRoutes, ([drone_id, routeCoord]) => ({drone_id, routeCoord}))
  //                               .map(obj => {
  //                                 return (
  //                                   <Marker
  //                                     title={'Drone Charging Stations'}
  //                                     name={'Drone'}
  //                                     icon={{
  //                                       url: "https://res.cloudinary.com/didymusne/image/upload/v1626512578/recharge_station_coloured_vbwy8s.png",
  //                                       anchor: new window.google.maps.Point(16,16),
  //                                       scaledSize: new window.google.maps.Size(32, 32),
  //                                     }}
  //                                     position={{lat: obj.latitude, lng: obj.longitude}} 
  //                                   />
  //                                   )
  //                               });

  const chargingStations = chargingRoutes.map(obj => {
    
    return (
    <Marker
      title={'Drone Charging Stations'}
      name={'Drone'}
      icon={{
        url: "https://res.cloudinary.com/didymusne/image/upload/v1626512578/recharge_station_coloured_vbwy8s.png",
        anchor: new window.google.maps.Point(16,16),
        scaledSize: new window.google.maps.Size(32, 32),
      }}
      position={{lat: obj.latitude, lng: obj.longitude}} 
    />
    )
  } )

  const merchantShops = merchantAddress === null 
    ? null 
    : (
      <Marker 
        title={merchantAddress.name + ' (' + merchantAddress.street_address + ')'}
        name={merchantAddress.name}
        icon={{
          url: "https://res.cloudinary.com/didymusne/image/upload/v1626514207/shop_aq8bdk.png",
          anchor: new window.google.maps.Point(16,16),
          scaledSize: new window.google.maps.Size(32, 32),
        }}
        position={{lat: merchantAddress.latitude, lng: merchantAddress.longitude}}
      />
  );

  const destination = customerAddress === null 
    ? null 
    : (
      <Marker 
        title={customerAddress.name + ' (' + customerAddress.street_address + ')'}
        name={customerAddress.name}
        icon={{
          url: "https://res.cloudinary.com/didymusne/image/upload/v1626521074/destination_kxogwh.png",
          anchor: new window.google.maps.Point(16,16),
          scaledSize: new window.google.maps.Size(32, 32),
        }}
        position={{lat: customerAddress.latitude, lng: customerAddress.longitude}}
      />
  )

  const routes = Array.from(route, ([drone_id, routeCoord]) => ({drone_id, routeCoord}));

  return (
    <Map google={props.google} zoom={12}
    initialCenter={{
      lat: 1.368635520835842,
      lng: 103.81916601690331
    }}>

      {droneMarkers}

      {chargingStations}

      {routes.map(obj => (
        <Polyline 
        path={obj.routeCoord.map(coord => new window.google.maps.LatLng(coord.latitude, coord.longitude))}
        strokeColor="#FF5C6D"
        strokeOpacity={0.8}
        strokeWeight={8}
      />
      ))}

      {/* <Polyline 
        path={route.map(coord => new window.google.maps.LatLng(coord.latitude, coord.longitude))}
        strokeColor="#FF5C6D"
        strokeOpacity={0.8}
        strokeWeight={8}
      /> */}

      {merchantShops}

      {destination}

    </Map>
  )


}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCEkczgoE41K_X4sk4maD-ju_64GB-zSj4'
})(MapContainer);