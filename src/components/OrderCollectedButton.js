import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import {makeStyles } from '@material-ui/core/styles';
import {customerAPI} from '../apis/rails-backend';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef( (props, ref) => {
    return <Slide direction="up" ref={ref} {...props}/>;
})

const OrderCollectedButton = (props) => {
    const orderID = props.orderID;
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);

    const classes = useStyles();

    const handleClick = (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        axios.post(customerAPI + '/' + localStorage.getItem('userID') + '/orders/' + orderID + '/customerCollectOrder', {
          headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
        }).then(response => {
            console.log(response);
            setOpen(true);
            if (response.statusText === "OK") {
                console.log('success');
                setSuccess(true);
            } else {
                console.log('fail');
                setSuccess(false);
            }
        });
      
    }

    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    }

    return (
        <div>
        <Button className={classes.button} onClick={handleClick}>
            Order Collected
            <ChevronRightIcon/>
        </Button>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            {success 
                ? 
                    (
                        <div>
                            <DialogTitle id="title">
                                Enjoy your order! 🎉
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Thank you for shopping with us! 
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    Close
                                </Button>
                            </DialogActions>
                        </div>
                    )
                :   (
                    <div>
                        <DialogTitle id="title">
                            Oh no... we encountered an error...
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                We checked and there are no orders in our system. Contact our hotline if this is a mistake.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>
                                Acknowledge
                            </Button>
                        </DialogActions>
                    </div>
                    )
            }
        </Dialog>
        </div>
    );

}

const useStyles = makeStyles((theme) => ({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(1.25),
      background: 'linear-gradient(45deg, #FF9068 30%, #FF4b1F 90%)',
      color: 'white',
    }
  }));

export default OrderCollectedButton;