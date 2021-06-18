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

// const sleep = (delay=0) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, delay);
//     });
// };

let address = [];
let postcode = [];

const AddressTextField = (props) => {
    const [options, setOptions] = useState([]);
    const loading = options.length === 0;

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        const savedAddresses = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(userAddressAPI, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const info = await response.data;
            let addresses = await info.map(infoObj => infoObj.street_address);
            postcode = await info.map(infoObj => infoObj.postcode);
            address = addresses;

            console.log(postcode);
            console.log(address);
            
            if (active) {
                setOptions(addresses);
            }
        };

        savedAddresses();

        return () => {
            active = false;
        };
    }, [loading]);


    return (
        <Autocomplete 
            id="address"
            freeSolo
            options={options}
            getOptionLabel={(option)=> option}
            getOptionSelected={(option, value) => option === value}
            loading={loading}
            defaultValue={null}
            autoSelect={true}
            onChange={(event, value) => props.change(value)}
            renderInput={ (params) => (
                <TextField
                    {...params}
                    label="Enter Your Addresss"
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

const Form = () => {
    const [state, setState] = useState({
        street: '',
        postal: parseInt(''),
    })

    const handleStreetInput = (input) => {
        console.log(input);
        setState({...state, street: input});
        console.log(state.street);
    }

    const handlePostalInput = (input) => {
        console.log(input);
        setState({...state, postal: input});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('submit');
    }

    const findPostalCode = () => {
        if (state.street) {
            let postVal = '';
            for (let i = 0; i < address.length; i++) {
                if (state.street === address[i]) {
                    postVal = postcode[i];
                    break;
                }
            }
        }
    }

    useEffect(() => {
        findPostalCode();
    })

    const classes = useStyles();

    return (
        <div>
            <Box className={classes.outerbox}>
            <Box className={classes.box} boxShadow={1} borderRadius={1}>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className={classes.textFields}>
                        <AddressTextField change={(input) => handleStreetInput(input)}/>
                        </div>
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
        width: '175px',
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