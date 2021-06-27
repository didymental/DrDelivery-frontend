import React from 'react';
import {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const OrderStatus = (props) => {
    const [status, setStatus] = useState(props.orderStatus === 201);
    const [open, setOpen] = useState(status);
    const handleOpen = (val) => {
        setOpen(val);
    }

    if (status) {
        return (
            <div>
                <Snackbar open={open} autoHideDuration={6000} onClose={() => handleOpen(false)}>
                    <Alert severity="success" onClose={() => handleOpen(false)}>
                        <AlertTitle>Success</AlertTitle>
                        We have received your order! We will fly to you soon!
                    </Alert>
                </Snackbar>
            </div>
        )
    } else {
        return (
            <Snackbar open={true} >
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        We could not process your order! Please try again.
                    </Alert>
            </Snackbar>
        )
    }
}

export default OrderStatus;