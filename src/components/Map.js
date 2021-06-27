import { Map, GoogleApiWrapper } from 'google-maps-react';
import React from 'react';

class MapContainer extends React.Component {
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