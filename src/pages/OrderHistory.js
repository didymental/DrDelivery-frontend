import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppHeader from '../components/AppHeader';
import PastOrders from '../components/PastOrders';

const OrderHistory = (props) => {
    return (
        <div>
            <AppHeader
                setOrder={props.setOrder}
                setState={props.setState}
                order={props.order}
            />
            <PastOrders/>
        </div>
    );
}

export default OrderHistory;