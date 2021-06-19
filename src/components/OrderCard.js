import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {userAddressAPI} from '../apis/rails-backend';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const AddressTextField = (props) => {
    const [options, setOptions] = useState([]);
    const loading = options.length === 0;
    const [state, setState] = useState({
        address: [],
        postal: [],
    });
    const [hasError, setError] = useState({
        error: false,
    })

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        const savedAddresses = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(userAddressAPI, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            const info = await response.data;
            let addresses = await info.map(infoObj => infoObj.street_address);
            let postal = await info.map(infoObj => infoObj.postcode);
            
            if (active) {
                setOptions(addresses);
                setState({...state, address: addresses, postal: postal});
            }
        };

        savedAddresses().catch(() => setError({...hasError, error: true}));

        return () => {
            active = false;
        };
    }, [loading]);

    const displayAddressDetails = (event, value) => {
        let postcode = '';
        for (let i = 0; i < state.address.length; i++) {
            if (value === state.address[i]) {
                postcode = state.postal[i];
                props.change(value, postcode)
                break;
            }
        }

        if (postcode === '' && value === null) { // changing address
            props.change('', '');
        }
    }


    return (
        <Autocomplete 
            id="address"
            freeSolo
            options={options}
            getOptionLabel={(option)=> option}
            getOptionSelected={(option, value) => option === value}
            loading={loading}
            autoSelect={true}
            onChange={(event, value) => displayAddressDetails(event, value)}            
            renderInput={ (params) => (
                <TextField
                    {...params}
                    disabled={hasError.error}
                    label="Where to fly to?"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={10}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        )
                    }} />
            )}
        />
    );
}

const Form = (props) => {
    const [state, setState] = useState({
        street: '',
        postal: parseInt(''),
    })

    const handleStreetInput = (streetInput, postalInput) => {
        console.log(streetInput);
        console.log(postalInput);
        setState({...state, street: streetInput, postal: postalInput});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('submit');
        props.handleOrder(state.street);
    }

    const classes = useStyles();

    return (
        <div>
            <Box className={classes.outerbox}>
                <Box className={classes.box} boxShadow={1} borderRadius={1}>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className={classes.textFields}>
                                <AddressTextField 
                                    change={(streetInput, postalInput) => handleStreetInput(streetInput, postalInput)}
                                />
                                </div>
                            <TextField 
                                    className={classes.textFields}
                                    id="postal-input"
                                    label="Postal Code"
                                    type="text"
                                    color="primary"
                                    value={state.postal ? state.postal : ''}
                                    disabled={true}
                            />
                            <Button 
                                className={classes.orderButton}
                                variant="contained" 
                                size="medium" 
                                type="submit"
                            >
                                <Typography variant="subtitle2">Fly Now</Typography>
                            </Button>                                
                        </form>
                    </div>
                </Box>
                <Button 
                    className={classes.updateButton}
                    variant="contained" 
                    size="small"
                >
                    <Typography variant="caption">Or Update Address</Typography>
                </Button>
            </Box>
        </div>
    )
}

const OrderCard = (props) => {
    const classes = useStyles();
    
    return (
        <div>
            <Form handleOrder={props.handleOrder}/>
        </div>
    );
}

const useStyles = makeStyles( (theme) => ({
    textFields: {
        marginLeft: '10px',
        color: '#09203f',
        width: '200px',
    },
    orderButton: {
        position: 'absolute',
        right: '20px',
        bottom: '35%',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    
    }, 
    updateButton: {
        marginTop: '30px',
        background: '#09203f',
        color: 'white',
        justifyContent: 'flex-end'
    }, 
    someSpan: {
        // display: 'flex',
        justifyContent: 'space-between'
    },
    box: {
        position: 'relative',
        padding: theme.spacing(2),
        background: '#FFFFFF',
    },
    outerbox: {
        padding: theme.spacing(2),
        maxWidth: '650px'
    },
    buttonContainer: {
        display: 'inline-blcok'
    }
}))

export default OrderCard;