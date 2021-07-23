import React from 'react';
import MapContainer from '../components/Map';
import AppHeader from '../components/AppHeader';
import {websocketAPI} from '../apis/rails-backend';

import {makeStyles} from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const Simulator = (props) => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(websocketAPI + '?token=' + token);
    const drones = new Map();
    const route = new Map();
    const merchantAddresses = new Map();
    const customerAddresses = new Map();
    const chargingRoutes = new Map();
    const classes = useStyles();

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
                entry={'menu'}
            />
    
        </div>);
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
        margin:'auto',
      width: '50%',
      height: '50%',
      //display: 'flex',
      marginRight: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    }
  
  }
  ));

export default Simulator;