/*global google*/
import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline  } from 'google-maps-react';
import axios from 'axios';
import {loginAPI, customerAPI, merchantAPI} from '../apis/rails-backend';
import React from 'react';
import {useState, useEffect} from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles} from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tracker from './Tracker';

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

const getCustAddress = async (f, addressID, droneID, customerAddress) => {
  const token = localStorage.getItem('token');
  axios.get(customerAPI + '/' + localStorage.getItem('userID') + '/addresses' + '/' + addressID, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
  }).then(response => {
    f(customerAddress.set(droneID, response.data));
  });
}

const getMerchantAddress = async (f, merchantID, addressID, droneID, merchantAddress) => {
  const token = await getAdminToken();

  axios.get(merchantAPI + '/' + merchantID + '/addresses' + '/' + addressID, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
  }).then(response => {
    
    f(merchantAddress.set(droneID, response.data));
  })
}

const MapContainer = (props) => {
  const [state, setState] = useState({
    drones: props.drones,
    ws: null,
    disconnected: true,
  });

  const [route, setRoute] = useState(props.route);
  const [chargingRoutes, setChargingRoutes] = useState(props.chargingRoutes);
  const [merchantAddress, setMerchantAddress] = useState(props.merchantAddresses);
  const [customerAddress, setCustomerAddress] = useState(props.customerAddresses);
  const [loadingDrone, setLoadingDrone] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loading, setLoading] = useState(true);
  const [assigned, setAssigned] = useState(false);
  const [noOrder, setNoOrder] = useState(true);
  
  
  const classes = useStyles();

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
      if (messageData.message !== undefined) {
        
        const text = messageData.message;
        
        data = JSON.parse(text);
        setNoOrder(false);
        
        
      }

      if (data.drone_curr_address !== undefined && data.drone_curr_address != null) { // if update from Drone Channel
        
        let drone = {
          id: data.drone.id,
          currLatitude: data.drone_curr_address.latitude,
          currLongitude: data.drone_curr_address.longitude,
        }
        setState({...state, drones: state.drones.set(drone.id, drone)});

        const droneLocation = { 
          latitude: parseFloat(data.drone_curr_address.latitude),
          longitude: parseFloat(data.drone_curr_address.longitude),
        }

        const stationsVisibleToUser = data.drone_address_route.slice(0, data.drone_address_route.length - 1);

        setRoute(route.set(data.drone.id, [droneLocation, ...stationsVisibleToUser]));

        setChargingRoutes(
          chargingRoutes.set(data.drone.id, stationsVisibleToUser.filter(obj => obj.addressable_type === "Station"))
        );
        setLoadingDrone(false);
        
      } 
      
      if (data.order !== undefined) { // if update from Order Channel
        console.log(data.order);
        getCustAddress(setCustomerAddress, data.order.drop_off_address_id, data.order.drone_id, customerAddress);
        getMerchantAddress(
          setMerchantAddress, 
          data.order.merchant_id, 
          data.order.pick_up_address_id, 
          data.order.drone_id,
          merchantAddress
        );
        setLoadingOrder(false);
        if (data.order.drone_id !== undefined) {
          console.log(data.order.drone_id);
          setAssigned(true);
        }

      }

      
      
      
    }


    setLoading(false);


  }

  const closeSocket = (event) => {
    
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

      setInterval(() => {
        props.ws.send(JSON.stringify({
          "command":"subscribe",
          "identifier":"{\"channel\":\"OrderChannel\"}"
        }));
    
        props.ws.send(JSON.stringify({
          "command":"message",
          "identifier":"{\"channel\":\"OrderChannel\"}", 
          "data":"{\"action\": \"request\"}"
        }));
      }, 5000);

      
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
    position={{lat: parseFloat(obj.drone.currLatitude), lng: parseFloat(obj.drone.currLongitude)}}
    icon={{
      url: "https://res.cloudinary.com/didymusne/image/upload/v1626512005/droneMarker_bclqa7.png",
      anchor: new props.google.maps.Point(16,16),
      scaledSize: new props.google.maps.Size(32,32)
    }} />

  ))


  const chargingStations = Array.from(chargingRoutes, ([key, value]) => ({key, value}))
                                .map(obj => obj.value.map( arr => {
                                  return (
                                    <Marker
                                      title={'Drone Charging Stations'}
                                      name={'Drone'}
                                      icon={{
                                        url: "https://res.cloudinary.com/didymusne/image/upload/v1626512578/recharge_station_coloured_vbwy8s.png",
                                        anchor: new props.google.maps.Point(16,16),
                                        scaledSize: new props.google.maps.Size(32, 32),
                                      }}
                                      position={{lat: arr.latitude, lng: arr.longitude}} 
                                    />
                                    )
                                }));
  


  const shops = Array.from(merchantAddress, ([key, value]) => ({key, value}));
  const destinations = Array.from(customerAddress, ([key, value]) => ({key, value}));
  const routes = Array.from(route, ([drone_id, routeCoord]) => ({drone_id, routeCoord}));
  

  const [shopInfo, setShopInfo] = useState(false);
  const [shopInfoWin, setShopInfoWin] = useState({
    latitude: null,
    longitude: null,
  });
  const displayShopWindow = (coord) => {
    if (shopInfo) {

    } else {
      setShopInfo(true);
      setShopInfoWin(coord);
    }
    
  }
  const hideShopWindow = () => {
    setShopInfo(false);
    setShopInfoWin({...shopInfoWin, latitude: null, longitude: null});
  }

  const [houseInfo, setHouseInfo] = useState(false);
  const [houseInfoWin, setHouseInfoWin] = useState({
    latitude: null,
    longitude: null,
  })
  const displayHouseWindow = (coord) => {
    if (houseInfo) {

    } else {
      setHouseInfo(true);
      setHouseInfoWin(coord);
    }
    
  }
  const hideHouseWindow = () => {
    setHouseInfo(false);
    setHouseInfoWin({...shopInfoWin, latitude: null, longitude: null});
  }

  const style = {
    //width: '50vw',
    //height: '75vh',
    'marginLeft': 'auto',
    'marginRight': 'auto',
    //'marginTop': '2vh',
  }

  return loading 
  ? <LinearProgress />
  : <Box>
    
    {/* {
      assigned && loadingDrone 
    ? (
    <Box className={classes.pastOrderContainer}>
        <Typography variant="h4">
            <Box fontWeight="fontWeightBold">
            A drone is being assigned to your order
            </Box>
        </Typography>
    </Box>)
    : noOrder && !loadingOrder
      ? (
        <Box className={classes.pastOrderContainer}>
        <Typography variant="h4">
            <Box fontWeight="fontWeightBold">
            There is no order in progress
            </Box>
        </Typography>
        </Box>
      )
      : (
        <Box className={classes.pastOrderContainer}>
        <Typography variant="h4">
            <Box fontWeight="fontWeightBold">
            
            </Box>
        </Typography>
        </Box>
      )
    } */}
    <Grid
      container
      direction="row"
    >
      <Grid 
        item 
        xs={12}
        >
          <Box borderBottom={0.2}>
          <Tracker entry={props.entry} />
          </Box>
      </Grid>
      <Grid 
        item 
        xs={12}
      >
          <Map google={props.google} zoom={12}
          initialCenter={{
            lat: 1.368635520835842,
            lng: 103.81916601690331
          }}
          gestureHandling='cooperative'
          // containerStyle={containerStyle}
          style={style}
          >

            

            {chargingStations}

            {routes.map( (obj, index) => (
              <Polyline 
              path={obj.routeCoord.map(coord => new window.google.maps.LatLng(coord.latitude, coord.longitude))}
              strokeColor={colors[index % 300]}
              strokeOpacity={0.8}
              strokeWeight={8}
            />
            ))}

            {
              shops.map( obj => {
                
                return (
                
                <Marker 
                  title={obj.value.name + ' (' + obj.value.street_address + ')'}
                  name={obj.value.name}
                  icon={{
                    url: "https://res.cloudinary.com/didymusne/image/upload/v1626785322/shopsss_d7met1.png",
                    anchor: new props.google.maps.Point(16,16),
                    scaledSize: new props.google.maps.Size(32, 32),
                  }}
                  position={{lat: obj.value.latitude, lng: obj.value.longitude}}
                  onMouseover={() => 
                    displayShopWindow({
                    latitude: obj.value.latitude, 
                    longitude: obj.value.longitude
                  })}
                  onMouseout={hideShopWindow}
              />
              )})
            }

                <InfoWindow 
                  visible={shopInfo}
                  position={{lat: parseFloat(shopInfoWin.latitude), lng: parseFloat(shopInfoWin.longitude)}}
                  onCloseClick={hideShopWindow}
                >
                
                  <CardMedia 
                    image='https://res.cloudinary.com/didymusne/image/upload/v1626787222/SHOP_2_dxqwxj.png'
                    style={{height: 47, width: 165}}
                  />
      "
                </InfoWindow>

            {
              destinations.map( obj => (
                <Marker 
                  title={obj.value.name + ' (' + obj.value.street_address + ')'}
                  name={obj.value.name}
                  icon={{
                    url: "https://res.cloudinary.com/didymusne/image/upload/v1626788922/image_4_kputdg.png",
                    anchor: new window.google.maps.Point(16,16),
                    scaledSize: new window.google.maps.Size(32, 32),
                  }}
                  position={{lat: parseFloat(obj.value.latitude), lng: parseFloat(obj.value.longitude)}}
                  onMouseover={() => displayHouseWindow({
                    latitude: obj.value.latitude, 
                    longitude: obj.value.longitude
                  })}
                  onMouseout={hideHouseWindow}
              />
              ))
            }

            {droneMarkers}

            <InfoWindow 
                  visible={houseInfo}
                  position={{lat: parseFloat(houseInfoWin.latitude), lng: parseFloat(houseInfoWin.longitude)}}
                  onCloseClick={hideHouseWindow}
                  
                >
                
                  <CardMedia 
                    image='https://res.cloudinary.com/didymusne/image/upload/v1626789214/DEST_xnldjd.png'
                    style={{height: 47, width: 165}}
                  />
                </InfoWindow>


          </Map>
        </Grid>
    </Grid>
  
  </Box>


}

const useStyles = makeStyles((theme) => ({
  container: {
      margin: 'auto',
      display: 'flex',
      padding: theme.spacing(2),
      // marginLeft: theme.spacing(2),
      // marginTop: theme.spacing(1),
  },
  pastOrderContainer: {
    display: 'flex',
    padding: theme.spacing(1.5),
    justifyContent: 'center',
    alignItems:'center',
    alignSelf: 'center',
  },
  mapContainer: {
    width: '70%',
    height: '70%',
  },
}
));

const colors = [
  '#D45F01',
  '#32A8D6',
  '#1A7C38',
  '#48223D',
  '#EA515E',
  '#923F13',
  '#6F1D3E',
  '#47600A',
  '#383F0B',
  '#163183',
  '#F0D29E',
  '#00E1D1',
  '#02963A',
  '#172463',
  '#79381',
  '#7824BB',
  '#3BC2DA',
  '#4DCD30',
  '#747A9E',
  '#E957DD',
  '#946B91',
  '#7CC3E9',
  '#D37A0B',
  '#B80239',
  '#13680',
  '#425ADF',
  '#C5C88B',
  '#26EA1E',
  '#5D75FA',
  '#E0B274',
  '#2B6864',
  '#8294B2',
  '#FD9D7B',
  '#CC8328',
  '#D08930',
  '#D5B3E2',
  '#8641AF',
  '#4ADD74',
  '#841074',
  '#8.55E+11',
  '#1BDDFC',
  '#F7339E',
  '#3D80A0',
  '#53463C',
  '#AC1FDF',
  '#8FB6CA',
  '#2C260B',
  '#438D33',
  '#D962FA',
  '#EA6FA3',
  '#F23A90',
  '#4BC71C',
  '#260B33',
  '#F0C53C',
  '#F17502',
  '#9F5DAE',
  '#DEA96C',
  '#692646',
  '#A3779A',
  '#49BCFC',
  '#E9C466',
  '#334EDB',
  '#A34D99',
  '#34DAB6',
  '#4FFFBF',
  '#BA87FE',
  '#D2120F',
  '#EB228C',
  '#BB085C',
  '#F9BF97',
  '#E526D1',
  '#5B36D4',
  '#5CF8E7',
  '#4A3538',
  '#122D2B',
  '#50077E',
  '#8C9C37',
  '#93021',
  '#86BCCF',
  '#4E17B4',
  '#20537C',
  '#109BCD',
  '#2D75E9',
  '#67023C',
  '#18A3F6',
  '#727C6F',
  '#98F33C',
  '#05A7A8',
  '#01F143',
  '#D5B89A',
  '#E1C6E3',
  '#58B5BE',
  '#2C3C4E',
  '#55F563',
  '#8493C2',
  '#EB4B12',
  '#E7A9D6',
  '#7F2BC7',
  '#91C863',
  '#BE7523',
  '#70EBB0',
  '#E98825',
  '#EA5151',
  '#8E2568',
  '#827F79',
  '#3F91B4',
  '#29EA20',
  '#01A52F',
  '#7BE904',
  '#29798F',
  '#3BFCDA',
  '#104FB7',
  '#0B8B1B',
  '#B87928',
  '#E415EA',
  '#5.15E+06',
  '#FF43FF',
  '#B0B4BD',
  '#66708',
  '#FED14B',
  '#B9C1DA',
  '#5CA90A',
  '#9CA405',
  '#20C87C',
  '#17AE8E',
  '#938645',
  '#192B33',
  '#5CF010',
  '#5302B8',
  '#ECF9A8',
  '#84B0B0',
  '#6CA98E',
  '#DEADEB',
  '#D4EE6A',
  '#6576F2',
  '#E76A82',
  '#BFF697',
  '#4.66E+37',
  '#A1A9F1',
  '#356BC6',
  '#DAE346',
  '#60656F',
  '#DA5499',
  '#94B4DA',
  '#510CCC',
  '#2960DB',
  '#73CD92',
  '#D6D3A6',
  '#C4A888',
  '#2E93B6',
  '#FD06ED',
  '#261E4A',
  '#011D4C',
  '#411F9A',
  '#8C81F3',
  '#8F1860',
  '#68777B',
  '#28C461',
  '#0A21AC',
  '#B29448',
  '#8C8A5E',
  '#BB723E',
  '#D56AAC',
  '#BA7EC1',
  '#B844D8',
  '#D5560A',
  '#4B5BD9',
  '#ABF159',
  '#D14500',
  '#6C9A06',
  '#3EC84C',
  '#297855',
  '#1F0006',
  '#AE7E38',
  '#EA4855',
  '#E94B19',
  '#742FC8',
  '#5E85F9',
  '#C9747B',
  '#C561DC',
  '#6C5B76',
  '#4FA6F7',
  '#F457A4',
  '#06D8A5',
  '#37AA88',
  '#7F5CAD',
  '#3ECE5B',
  '#540BBA',
  '#0B0E4B',
  '#382E2B',
  '#79AC64',
  '#992687',
  '#2DC297',
  '#CA3D87',
  '#9CFBA2',
  '#61C0E2',
  '#58C7E4',
  '#F02C2C',
  '#4F67DF',
  '#F6BF25',
  '#0FED7D',
  '#16E331',
  '#F706FD',
  '#5E40E6',
  '#60FEF9',
  '#4083DF',
  '#0F6E39',
  '#F3009F',
  '#EEE2FD',
  '#95E83D',
  '#18E9BB',
  '#8CAFBD',
  '#8B19CA',
  '#9A98D8',
  '#56E4E2',
  '#10A096',
  '#B2361E',
  '#4AA536',
  '#0C095E',
  '#1A4FE3',
  '#103C0D',
  '#2CF631',
  '#47BFDF',
  '#5DC661',
  '#48C97A',
  '#D9B05C',
  '#D88DEB',
  '#E33A20',
  '#98E5E4',
  '#73C3C4',
  '#D9E9A3',
  '#58CE5B',
  '#A4FDE1',
  '#E7ACD8',
  '#04CD78',
  '#2520ED',
  '#34503A',
  '#BDEBBD',
  '#C94752',
  '#F66B4E',
  '#464763',
  '#4A7ABA',
  '#468323',
  '#1EC662',
  '#859F1D',
  '#D632EA',
  '#534CDF',
  '#726068',
  '#3770DD',
  '#353C55',
  '#92CD4A',
  '#7ADC6A',
  '#CED3E3',
  '#C2A337',
  '#16D522',
  '#BC579A',
  '#214FEB',
  '#AA98E8',
  '#BAA5EE',
  '#DF4B56',
  '#D0327C',
  '#DAE1AC',
  '#C576D5',
  '#E8F9ED',
  '#7CDB72',
  '#25357B',
  '#25516F',
  '#E24592',
  '#B8BB19',
  '#99675D',
  '#A82DDA',
  '#80FE16',
  '#DF9252',
  '#41AFCC',
  '#966FDB',
  '#D74042',
  '#BD2BB4',
  '#194BC9',
  '#D0A807',
  '#4AEBAB',
  '#683B98',
  '#056AD3',
  '#1FE8C1',
  '#10933C',
  '#11673B',
  '#6DD9CF',
  '#DC5373',
  '#79251E',
  '#62FF63',
  '#C852F8',
  '#E55CF2',
  '#CDF117',
  '#4807D2',
  '#63563C',
  '#9F4E23',
  '#709DD8',
  '#095FB7',
  '#60F78C',
  '#9E0E53'
];

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCEkczgoE41K_X4sk4maD-ju_64GB-zSj4'
})(MapContainer);