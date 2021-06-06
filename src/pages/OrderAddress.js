import React from 'react';
import {Link} from 'react-router-dom';
import HorizontalLabelPositionBelowStepper from '../components/HorizontalLabelPositionBelowStepper.js';
import YourAddressHeader from '../components/YourAddressHeader.js';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';

const OrderAddress = () => {
    return (
        <div>
            <Link to="/home">
                <ArrowBackIosOutlinedIcon style={{fill: "#979797"}}/>
            </Link>
            <YourAddressHeader/>
            <HorizontalLabelPositionBelowStepper/>
        </div>
    )
}

export default OrderAddress;