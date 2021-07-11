import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppHeader from '../components/AppHeader';
import PastOrders from '../components/PastOrders';

import Container from '@material-ui/core/Container';

const OrderHistory = (props) => {
    const classes = useStyles();
    return (
        <div>
            <AppHeader
                setOrder={props.setOrder}
                setState={props.setState}
                order={props.order}
            />
            <Container className={classes.main}>
                <PastOrders/>
            </Container>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
}));

export default OrderHistory;