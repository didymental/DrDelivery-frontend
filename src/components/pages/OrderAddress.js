import React from 'react';
import {Link} from 'react-router-dom';
import HorizontalLabelPositionBelowStepper from '../HorizontalLabelPositionBelowStepper.js';
import SavedAddressCard from '../SavedAddressCard.js';
import YourAddressHeader from '../YourAddressHeader.js';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';

const OrderAddress = () => {
    return (
        <div>
            
            <Link to="/">
                <ArrowBackIosOutlinedIcon style={{fill: "#979797"}}/>
            </Link>
            <YourAddressHeader/>
            <HorizontalLabelPositionBelowStepper/>
            <SavedAddressCard/>
        </div>
    )
}

export default OrderAddress;