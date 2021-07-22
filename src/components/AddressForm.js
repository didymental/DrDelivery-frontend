import React from 'react';
import {useState} from 'react';
import {customerAPI} from '../apis/rails-backend';
import Logo from './Logo';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const AddressForm = (props) => {

    const [state, setState] = useState(
        {
            street_address: '',
            city: parseInt(''),
            country: '',
            postcode: '', 
            building_no: '',
            unit_number: '',
            name: '',
            errorMessages: [],
        });

    const classes = useStyles();

    const handleNameInput = (input) => {
        setState({...state, name: input.target.value});
    };
    const handleStreetAddInput = (input) => {
        setState({...state, street_address: input.target.value});
    };
    const handleCityInput = (input) => {
        setState({...state, city: input.target.value});
    };
    const handleCountryInput = (input) => {
        setState({...state, country: input.target.value});
    };
    const handlePostCode = (input) => {
        setState({...state, postcode: input.target.value}); 
    };
    const handleBuildingNumInput = (input) => {
        setState({...state, building_no: input.target.value});
    };
    const handleUnitNumInput = (input) => {
        setState({...state, unit_number: input.target.value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let add = {...state};
        const token = localStorage.getItem('token');
        axios.post(customerAPI + '/' + localStorage.getItem('userID') + '/addresses', add, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(response => {
            if (response.status === 201) {
                props.handleSuccess(true);
                props.handleClose();
            }
        }).catch(err => {
            console.log(err);
            setState({...state, errorMessages: [...state.errorMessages, err.response.data.message]});
        });
    }

    console.log(state.errorMessages);

    return (
        
        <div>
            <Box bgcolor="#FFFFFF" borderRadius={10}>
            <Logo color='orange'/>
            <form  className={classes.root} onSubmit={handleSubmit}> 
                <div className={classes.actionCard}>
                    <TextField
                        id="name"
                        label="Address Name"
                        variant="outlined"
                        onChange={handleNameInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Name")
                                    ? 'Name cannot be blank'
                                    : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Invalid address created")
                                    ? 'Name is invalid'
                                    : null
                            }
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="building-no"
                        label="Building Number"
                        variant="outlined"
                        onChange={handleBuildingNumInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Building no can't be blank") 
                                    ? 'Building number cannot be blank'
                                    : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Building") 
                                        ? 'Building number must be a number'
                                        : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Invalid address created")
                                        ? 'Building number is invalid'
                                            : null
                            }
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="street"
                        label="Street"
                        variant="outlined"
                        onChange={handleStreetAddInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            :  state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Street")
                                ? 'Street Address cannot be blank'
                                : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Invalid address created")
                                ? 'Street Address is invalid'
                                : null
                            }
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="unit-no"
                        label="Unit Number"
                        variant="outlined"
                        onChange={handleUnitNumInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Unit")
                                    ? 'Unit Number cannot be blank'
                                    : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Invalid address created")
                                    ? 'Unit Number is invalid'
                                    : null
                            }
                        />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="postal-code"
                        label="Postal Code"
                        variant="outlined"
                        onChange={handlePostCode}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Postcode can't be blank")
                                ? 'Postal Code cannot be blank'
                                : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Postcode is not a number")
                                    ? 'Postal Code must be a number'
                                    : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Invalid address created")
                                    ? 'Postal code is invalid'
                                    : null
                            }
                        />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="city"
                        label="City"
                        variant="outlined"
                        onChange={handleCityInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("City")
                                ? 'City cannot be blank'
                                : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Invalid address created")
                                ? 'City is invalid'
                                : null
                            }
                        />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="country"
                        label="Country"
                        variant="outlined"
                        onChange={handleCountryInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Country") 
                                ? 'Country cannot be blank'
                                : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Invalid address created")
                                ? 'Country is invalid'
                                : null
                            }
                        />
                </div>
                
                <div className={classes.actionButton}>
                        <Button
                            className={classes.add}
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            type="submit">
                            Add Address
                        </Button>
                </div>
            </form>
            <br/>
            </Box>
        </div>
    )
}


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
    },
    actionCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(1.5),
    },
    actionButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    add: {
        background: '#09203f',
        border: 0,
        boxShadow: '0 3px 5px 2px rgba(200, 200, 255, .3)',
        color: 'white',
        borderRadius: 10,
    }
  }));

export default AddressForm;