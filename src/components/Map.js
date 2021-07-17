import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline  } from 'google-maps-react';
import React from 'react';
import {useState, useEffect} from 'react';

const MapContainer = (props) => {
  const [state, setState] = useState({
    drones: props.drones,
    ws: null,
    disconnected: true,
  });

  const [route, setRoute] = useState([]);
  const [chargingRoutes, setChargingRoutes] = useState([]);
  const [merchantAddress, setMerchantAddress] = useState([]);
  const [customerAddress, setCustomerAddress] = useState([]);

  function immutableUpdate(arr, newDrone, i) {
    return arr.map((item, index) => i === index ? newDrone: item );
  }


  const openEventListener = (event) => {
    console.log('WebSocket Client Connected');
    props.ws.send(JSON.stringify({
      "command":"subscribe",
      "identifier":"{\"channel\":\"OrderChannel\"}"
    }));

    props.ws.send(JSON.stringify({
      "command":"subscribe",
      "identifier":"{\"channel\":\"DroneChannel\"}"
    }));



    props.ws.send(JSON.stringify({
      "command":"message",
      "identifier":"{\"channel\":\"OrderChannel\"}", 
      "data":"{\"action\": \"request\"}"
    }));

    
    props.ws.send(JSON.stringify({
      "command":"message",
      "identifier":"{\"channel\":\"DroneChannel\"}", 
      "data":"{\"action\": \"request\"}"
    }));

    setState({...state, ws: props.ws, disconnected: false});
  }

  const incomingMessageListener = (message) => {
    let messageData = JSON.parse(message.data);
    console.log(messageData);
    if (messageData.type !== "ping") {
      var data = {};
      if (messageData.message != null) {
        data = JSON.parse(messageData.message);
        console.log(data);
      }

      if (data.drone_curr_address !== undefined && data.drone_curr_address != null) { // if update from Drone Channel
        console.log('taking from Drone Channel');
        let drone = {
          id: data.drone.id,
          currLatitude: data.drone_curr_address.latitude,
          currLongitude: data.drone_curr_address.longitude,
        }
        setState({...state, drones: state.drones.set(drone.id, drone)});
        setRoute(data.drone_address_route.map(item =>  {
          return {lat: item.latitude, lng: item.longitude};
        }));
        setChargingRoutes(data.drone_address_route.filter(obj => obj.addressable_type === "Station"));

        setMerchantAddress([data.drone_address_route.filter(obj => obj.addressable_type !== "Station")[0]]);
        setCustomerAddress([data.drone_address_route.filter(obj => obj.addressable_type !== "Station")[1]]);
        console.log('merchant address')
        console.log(data.drone_address_route.filter(obj => obj.addressable_type !== "Station")[0]);
      } 
      
      // if (data.order_curr_address != null && data.order.drone_id != null) { // if update from Order Channel
      //   console.log('taking from Order Channel');
      //   // let drone = {
      //   //   id: data.order.drone_id,
      //   //   currLatitude: data.order_curr_address.latitude,
      //   //   currLongitude: data.order_curr_address.longitude,
      //   // }
      //   // console.log(drone.id);
      //   // setState({...state, drones: state.drones.set(drone.id, drone)});

      // }

      
    }
  }

  const closeSocket = (event) => {
    console.log("Disconnected from WS");
    setState({...state, disconnected: true});
  }

  useEffect(() => {
    props.ws.addEventListener('open', openEventListener);
    props.ws.addEventListener('message', incomingMessageListener);
    props.ws.addEventListener('close', closeSocket);

    console.log(state.drones);

    return () => {
      props.ws.close();
    }
  }, []);

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

  const arrForm = Array.from(state.drones, (([drone_id, drone]) => ({drone_id, drone})));
  console.log(arrForm);

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

  const chargingStations = chargingRoutes.map(obj => {
    console.log(obj);
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

  const merchantShops = merchantAddress[0] === undefined ? null : merchantAddress.map(obj => {
    //console.log(obj);
    return (
      <Marker 
        title={obj.name + ' (' + obj.street_addresss + ')'}
        name={obj.name}
        icon={{
          url: "https://res.cloudinary.com/didymusne/image/upload/v1626514207/shop_aq8bdk.png",
          anchor: new window.google.maps.Point(16,16),
          scaledSize: new window.google.maps.Size(32, 32),
        }}
      />
    )
  })

  const destination = customerAddress[0] === undefined ? null : customerAddress.map(obj => {
    console.log(obj);
    return (
      <Marker 
        title={obj.name + ' (' + obj.street_addresss + ')'}
        name={obj.name}
        icon={{
          url: "https://res.cloudinary.com/didymusne/image/upload/v1626521074/destination_kxogwh.png",
          anchor: new window.google.maps.Point(16,16),
          scaledSize: new window.google.maps.Size(32, 32),
        }}
      />
    )
  })

  // const routeMapper = (
  //     <Polyline
  //       path={route.map(item =>  {
  //         return {lat: item.latitude, lng: item.longitude};
  //       })}
  //       strokeColor="#FF5C6D"
  //       strokeOpacity={0.8}
  //       strokeWeight={8}
  //     />
  //   );

  // const drone2line = function (drone) {
  //   const coords = [
  //     {lat: drone.curr_latitude,  lng: drone.curr_longitude},
  //     {lat: drone.dest_latitude,  lng: drone.dest_longitude}
  //   ]
  //   return <Polyline
  //   path={coords}
  //   strokeColor="#0000FF"
  //   strokeOpacity={0.8}
  //   strokeWeight={8} />
  // }

  // const dronelines = arrForm.map(drone2line)
  // const dronelines = [
  //     <Polyline
  //     path={crossIslandCoords}
  //     strokeColor="#0000FF"
  //     strokeOpacity={0.8}
  //     strokeWeight={2} />   ,

  //     <Polyline
  //     path={samePoint}
  //     strokeColor="#0000FF"
  //     strokeOpacity={0.8}
  //     strokeWeight={2} />  
  // ]

  console.log(route);
  return (
    <Map google={props.google} zoom={12}
    initialCenter={{
      lat: 1.368635520835842,
      lng: 103.81916601690331
    }}>

    {/* <Polyline
    path={crossIslandCoords}
    strokeColor="#0000FF"
    strokeOpacity={0.8}
    strokeWeight={2} /> */}

    {/* <Marker
    title={'The marker`s title will appear as a tooltip.'}
    name={'SOMA'}
    position={{lat: drone.curr_latitude, lng: drone.curr_longitude}}
    icon={{
      url: "https://i.pinimg.com/736x/b3/cc/d5/b3ccd57b054a73af1a0d281265b54ec8.jpg",
      anchor: new window.google.maps.Point(16,16),
      scaledSize: new window.google.maps.Size(32,32)
    }} /> */}

      {/* {     
        dronelines
      } */}

      {droneMarkers}

      {chargingStations}

      <Polyline 
        path={route.map(coord => new window.google.maps.LatLng(coord.lat, coord.lng))}
        strokeColor="#FF5C6D"
        strokeOpacity={0.8}
        strokeWeight={8}
        />

      {merchantShops}

      {destination}

    </Map>
  )


}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCEkczgoE41K_X4sk4maD-ju_64GB-zSj4'
})(MapContainer);