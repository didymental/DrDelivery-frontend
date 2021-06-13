import React from 'react';
import {useState} from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const Form = () => {
    const [state, setState] = useState({
        street: '',
        postal: parseInt(''),
    })

    const handleStreetInput = (input) => {
        setState({...state, street: input.target.value});
    }

    const handlePostalInput = (input) => {
        setState({...state, postal: input.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('submit');
    }

    const classes = useStyles();

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <TextField 
                    className={classes.textFields}
                    id="address-input"
                    label="Enter Your Address"
                    type="text"
                    variant="filled"
                    onChange={(input) => console.log(input.target.value)}
                    color="secondary"
                />
                <TextField 
                    className={classes.textFields}
                    id="postal-input"
                    label="Postal Code"
                    type="text"
                    variant="filled"
                    color="secondary"
                    onChange={(input) => console.log(input.target.value)}
                />
                
                <Button 
                    className={classes.orderButton}
                    variant="contained" 
                    size="medium" 
                    
                    type="submit"
                >
                    Make an Order   
                </Button>
            </form>
        </div>
    )
}
// <Link to="/order/address">
const OrderCard = (props) => {
    const classes = useStyles();

    return (
        <div>
            {Form()}
                    
        </div>
    );
}

const useStyles = makeStyles( (theme) => ({
    textFields: {
        marginLeft: '10px',
    },
    orderButton: {
        marginLeft: '50px',
        minHeight: '50px',
    }
}))

export default OrderCard;