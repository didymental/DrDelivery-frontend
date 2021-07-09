import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MapContainer from '../components/Map';
import AppHeader from '../components/AppHeader';

const Simulator = (props) => {
    return (<div>
        <AppHeader
            setOrder={props.setOrder}
            setState={props.setState}
            order={props.order}/>
        <MapContainer/>
        </div>);
}

export default Simulator;