import React from 'react';
import {useState} from 'react';
import {customerAPI} from '../apis/rails-backend';
import axios from 'axios';
import EditableTextField from './EditableTextField';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import MenuItem from '@material-ui/core/MenuItem';


const EditAddress = (props) => {
    const address = props.address;
    const [state, setState] = useState({
        street_address: address.street_address,
        city: address.city,
        country: address.country,
        postal_code: address.postal_code,
        building_number: address.building_number,
        unit_number: address.unit_number,
        name: address.name,
        errorMessages: [],
    });

    function findError(errArr, str) {
        if (errArr[0] === 'We are currently facing an issue, please try again another time') {
            return <MenuItem>{errArr[0]}</MenuItem>
        } else if (errArr.filter(msg => msg.includes("Invalid")).length > 0) { // invalid address error
            if (str === "Postal" || str === "Country") {
                return <MenuItem>Address is invalid</MenuItem>;
            }
        } else {
            const relevantMessages = (
                <Box>
                    {
                        
                        errArr.filter(msg => msg.includes(str)).map( msg => <MenuItem>{msg}</MenuItem>)
                    }
                </Box>
            )
            
            return relevantMessages;
        }
    }

    const saveAddress = () => {
        let toPost = {...state};
        axios.patch(customerAPI + '/' + localStorage.getItem('userID') + '/addresses' + '/' + address.id, toPost, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if (response.statusText === "OK") {
                props.setOpen(true);
                props.setAddSuccess(!props.addSuccess);
                setState({...state, errorMessages: []});
                setState({...state});
            }
        }).catch(err => {
            
            setState({...state, errorMessages: err.response.data.message})
        });

    }

    const classes = useStyles();

    return (
        <Box>
        <Grid container>
            <Grid item>
                <EditableTextField
                name={'Name'}
                value={address.name}
                handleChange={(text) => {
                    setState({...state, name: text});
                }}
                error={state.errorMessages.length !== 0}
                helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Name")}
            />
            </Grid>
            <Grid item>
                <EditableTextField
                name={'Building Number'}
                value={address.building_number}
                handleChange={(text) => {
                    setState({...state, building_number: text});
                }}
                error={state.errorMessages.length !== 0}
                helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Building")}
            />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'Street Address'}
                    value={address.street_address}
                    handleChange={(text) => {
                        setState({...state, street_address: text});
                    }}
                    error={state.errorMessages.length !== 0}
                    helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Street")}
                />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'Unit Number'}
                    value={address.unit_number}
                    handleChange={(text) => {
                        setState({...state, unit_number: text});
                    }}
                    error={state.errorMessages.length !== 0}
                    helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Unit")}
                />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'Postal Code'}
                    value={address.postal_code}
                    handleChange={(text) => {
                        setState({...state, postal_code: text});
                    }}
                    error={state.errorMessages.length !== 0}
                    helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Postal")}
                />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'City'}
                    value={address.city}
                    handleChange={(text) => {
                        setState({...state, city: text});
                    }}
                    error={state.errorMessages.length !== 0}
                    helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "City")}
                />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'Country'}
                    value={address.country}
                    handleChange={(text, f) => {
                        setState({...state, country: text});
                        f(false);
                    }}
                    error={state.errorMessages.length !== 0}
                    helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Country")}
                />
            </Grid>
        </Grid>
        <Button 
            className={classes.saveButton}
            onClick={saveAddress}
        >
                <IconButton className={classes.saveIcon}>
                <SaveIcon/>
                </IconButton>
                Save Changes
            </Button>
        </Box>
    )

    
}

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
    },
    saveButton: {
        color: 'white',
        background: '#1AA260',
        padding: theme.spacing(0.5),
    },
    saveIcon: {
        color:'white',
        padding: theme.spacing(0.5),

    }
}));

export default EditAddress;