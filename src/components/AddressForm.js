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
        });
    }

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
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="building-no"
                        label="Building Number"
                        variant="outlined"
                        onChange={handleBuildingNumInput}
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="street"
                        label="Street"
                        variant="outlined"
                        onChange={handleStreetAddInput}
                    />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="unit-no"
                        label="Unit Number"
                        variant="outlined"
                        onChange={handleUnitNumInput}
                        />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="postal-code"
                        label="Postal Code"
                        variant="outlined"
                        onChange={handlePostCode}
                        />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="city"
                        label="City"
                        variant="outlined"
                        onChange={handleCityInput}
                        />
                </div>
                
                <div className={classes.actionCard}>
                    <TextField
                        id="country"
                        label="Country"
                        variant="outlined"
                        onChange={handleCountryInput}
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