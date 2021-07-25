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


const EditAddress = (props) => {
    const address = props.address;
    const [state, setState] = useState({
        street_address: address.street_address,
        city: address.city,
        country: address.country,
        postal_code: address.postal_code,
        building_no: address.building_no,
        unit_number: address.unit_number,
        name: address.name,
    });

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
                props.setSuccess(true);
            }
        }).catch(err => {
            props.setOpen(true);
            props.setSuccess(false);
            props.setError([...props.error, err.response.data.message]);;
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
            />
            </Grid>
            <Grid item>
                <EditableTextField
                name={'Building Number'}
                value={address.building_no}
                handleChange={(text) => {
                    setState({...state, building_no: text});
                }}
            />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'Street Address'}
                    value={address.street_address}
                    handleChange={(text) => {
                        setState({...state, street_address: text});
                    }}
                />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'Unit Number'}
                    value={address.unit_number}
                    handleChange={(text) => {
                        setState({...state, unit_number: text});
                    }}
                />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'Postal Code'}
                    value={address.postal_code}
                    handleChange={(text) => {
                        setState({...state, postal_code: text});
                    }}
                />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'City'}
                    value={address.city}
                    handleChange={(text) => {
                        setState({...state, city: text});
                    }}
                />
            </Grid>
            <Grid item>
                <EditableTextField
                    name={'Country'}
                    value={address.country}
                    handleChange={(text) => {
                        setState({...state, country: text});
                    }}
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