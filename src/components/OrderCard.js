import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import {userAddressAPI} from '../apis/rails-backend';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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

    const savedAddresses = async () => { 
        const response = await axios.get(userAddressAPI, {
            headers: {
                'Authorization': `token ${localStorage.getItem('token')}`
            }
        });
        const info = await response.data;
        let addresses = await info.map(infoObj => infoObj.street_address);
        let postalCodes = await info.map(infoObj => infoObj.postcode);
        
        return [addresses, postalCodes];
    }

    return (
        <div>
            <Box className={classes.outerbox}>
            <Box className={classes.box} boxShadow={1} borderRadius={1}>
                <div>
                    <form onSubmit={handleSubmit}>
                            <TextField 
                                className={classes.textFields}
                                id="address-input"
                                label="Enter Your Address"
                                type="text"
                                onChange={(input) => console.log(input.target.value)}
                                color="primary"
                            />
                            <TextField 
                                className={classes.textFields}
                                id="postal-input"
                                label="Postal Code"
                                type="text"
                                color="primary"
                                onChange={(input) => console.log(input.target.value)}
                            />
                        
                            <Button 
                                className={classes.orderButton}
                                variant="contained" 
                                size="medium" 
                                type="submit"
                                onClick={ async () => {
                                    let addresses =  await savedAddresses();
                                    console.log(addresses);
                                }}
                            >
                                <Typography variant="subtitle2">Fly with us</Typography>
                            </Button>
                            
                    </form>
                </div>
            </Box>
            </Box>
        </div>
    )
}

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
        color: '#09203f',
    },
    orderButton: {
        marginLeft: '50px',
        marginTop: '10px',
        minHeight: '30px',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    
    }, 
    box: {
        padding: theme.spacing(2),
        background: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerbox: {
        padding: theme.spacing(2),
        maxWidth: '550px'
    },
    buttonContainer: {
        display: 'inline-blcok'
    }
}))

export default OrderCard;