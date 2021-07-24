import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {customerAPI} from '../apis/rails-backend';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddressForm from './AddressForm';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FormDialog = ({open, setOpen, handleSuccess, success}) => {
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    
    const classes = useStyles();

    return (
        <div>
            <div>
                 <Button 
                     className={classes.updateButton}
                     variant="contained" 
                     size="small"
                     onClick={handleClickOpen}
                 >
                     <Typography variant="caption">Add Address</Typography>
                 </Button> 
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add Your Addresss</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            In order to make a delivery, we have to save your address! Rest assured that your information remains safe with us, abiding strictly to PDPA guidelines set out by your government. 
                        </DialogContentText>
                        <AddressForm handleClose={handleClose} handleSuccess={handleSuccess}/>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="default">
                        Skip
                    </Button>
                    </DialogActions>
                </Dialog>

            </div>
            <div>
                <Snackbar open={success} autoHideDuration={3000} onClose={() => handleSuccess(false)}>
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        We have saved your address! You can fly now!
                    </Alert>
                </Snackbar>
            </div>
         </div>
    )

}

const AddressTextField = (props) => {
    const [open, setOpen] = useState(false);
    
    
    const [state, setState] = useState({
        address: null,
        postal: [],
        addressID: '',
    });
    const [error, setError] = useState({
        hasError: false,
    })
    const loading = props.options.length === 0 && open && 
        (state.address === null 
            ? true
            : state.address.length !== 0
        );

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }

        const source = axios.CancelToken.source();

        const savedAddresses = async () => {
            const token = localStorage.getItem('token');
            const userid = localStorage.getItem('userID');
            const response = await axios.get(customerAPI + '/' + userid + '/addresses', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            const info = await response.data;
            let addresses = await info.map(infoObj => infoObj.name);
            let postal = await info.map(infoObj => infoObj.building_no + ' ' + infoObj.street_address);
            let addressID = await info.map(infoObj => infoObj.id);
            if (active) {
                props.setOptions(addresses);
                setState({...state, address: addresses, postal: postal, addressID: addressID}); 
            }
        };

        savedAddresses().catch(() => setError({...error, hasError: true}));

        return () => {
            source.cancel('axios request cancelled');
            active = false;
        };
    }, [loading, setError, setState, error, props, state]);

    const displayAddressDetails = (event, value) => {
        let postcode = '';
        let addressID = '';
        for (let i = 0; i < state.address.length; i++) {
            if (value === state.address[i]) {
                postcode = state.postal[i];
                addressID = state.addressID[i];
                props.change(value, postcode, addressID)
                
                break;
            }
        }

        if (postcode === '' && value === null) { // changing address
            // props.updateAddress('');
            props.change('', '', '');
         
        }
    }


    return (
        
        <Autocomplete 
            id="address"
            open={open}
            onOpen={ () => { 
                setOpen(true);
            }}
            onClose={ () => {
                setOpen(false);
                props.setOptions([]); // enable reload each time it is open
            }}
            options={props.options}
            getOptionLabel={(option)=> option}
            getOptionSelected={(option, value) => option === value}
            loading={loading}
            autoSelect={true}
            onChange={(event, value) => displayAddressDetails(event, value)}            
            renderInput={ (params) => (
                <TextField
                    {...params}
                    disabled={error.hasError}
                    label="Select a saved address"
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
    const matches = useMediaQuery('(min-width: 768px)');
    const [state, setState] = useState({
        street: '',
        postal: parseInt(''),
        addressID: '',
    })
    const [options, setOptions] = useState([...props.addresses]);

    const handleStreetInput = (streetInput, postalInput, addIDInput) => {
        setState({...state, street: streetInput, postal: postalInput, addressID: addIDInput});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.handleOrder(state.street);
        props.updateAddress(state.addressID);
    }

    const classes = useStyles();

    // const [open, setOpen] = useState(true);

    return (
        <div>
            {/* <Snackbar open={open} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <Alert severity="info" onClose={() => setOpen(false)}>
                        <AlertTitle>Take Note</AlertTitle>
                        Add an address if you have not never saved an address!
                    </Alert>
            </Snackbar> */}
            <Box className={classes.outerbox}>
                <Box className={classes.box} boxShadow={1} borderRadius={1}>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className={matches ? classes.textFieldsDesktop : classes.textFields}>
                                <AddressTextField 
                                    change={(streetInput, postalInput, addressID) => 
                                        handleStreetInput(streetInput, postalInput, addressID)
                                    }
                                    success={props.success}
                                    options={options}
                                    setOptions={setOptions}
                                    setState={props.setState}
                                    state={props.state}
                                />
                                </div>
                            <TextField 
                                    className={matches ? classes.textFieldsDesktop : classes.textFields}
                                    id="address"
                                    label="Address"
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
                <Container>
                    <FormDialog 
                        open={props.open}
                        setOpen={props.setOpen} 
                        handleSuccess={props.handleSuccess} 
                        success={props.success}/>
                </Container>
            </Box>
        </div>
    )
}

const OrderCard = (props) => {  
    const [success, setSuccess] = useState(false);
    const handleSuccess = (status) => {
        setSuccess(status);
    }

    const [addresses, setAddresses] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const source = axios.CancelToken.source();
        let active = true;

        const savedDetails = async () => {
            const token = localStorage.getItem('token');
            const userID = localStorage.getItem('userID');
            const addressResponse = await axios.get(customerAPI + '/' + userID + '/addresses', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            const savedAddresses = await addressResponse.data;
            if (active) {
                setAddresses(savedAddresses);
                setOpen(savedAddresses.length === 0);
            }
        };
        
        savedDetails();

        return () => {
            source.cancel('axios request cancelled');
            active = false;
        };
    
    }, [setAddresses, setOpen]);

    return (
        <div>
            <Form 
                open={open} 
                setOpen={setOpen}
                handleOrder={props.handleOrder} 
                updateAddress={props.updateAddress}
                handleSuccess={handleSuccess}
                success={success}
                addresses={addresses}
            />
        </div>
    );
}

const useStyles = makeStyles( (theme) => ({
    textFields: {
        marginLeft: '10px',
        color: '#09203f',
        width: '175px',
    },
    textFieldsDesktop: {
        marginLeft: '10px',
        color: '#09203f',
        width: '240px',
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
        padding: theme.spacing(4),
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