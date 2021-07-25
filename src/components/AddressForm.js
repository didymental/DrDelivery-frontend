import React from 'react';
import {useState} from 'react';
import {customerAPI} from '../apis/rails-backend';
import Logo from './Logo';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';


const AddressForm = (props) => {

    const [state, setState] = useState(
        {
            street_address: '',
            city: parseInt(''),
            country: '',
            postal_code: '', 
            building_number: '',
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
    const handlePostalCode = (input) => {
        setState({...state, postal_code: input.target.value}); 
    };
    const handleBuildingNumInput = (input) => {
        setState({...state, building_number: input.target.value});
    };
    const handleUnitNumInput = (input) => {
        setState({...state, unit_number: input.target.value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let add = {...state};
        const token = localStorage.getItem('token');
        console.log(add);
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
            console.log(err.response.data.message);
            if (err.response.data.message === undefined) {
                setState({...state, errorMessages: ['We are currently facing an issue, please try again another time']})
            } else {
                setState({...state, errorMessages: state.errorMessages.concat(err.response.data.message)});
            }
            
        });
    }

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

    return (
        
        <div>
            <Box bgcolor="#FFFFFF" borderRadius={10}>
            <Logo color='orange'/>
            <form  className={classes.root} onSubmit={handleSubmit}> 
                
                    <TextField
                        className={classes.actionCard}
                        id="name"
                        label="Address Name"
                        variant="outlined"
                        onChange={handleNameInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Name")
                            // state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Name")
                            //         ? 'Name cannot be blank'
                            //         : state.errorMessages.reduce((acc, curr) => acc + curr, '').includes("Invalid address created")
                            //         ? 'Name is invalid'
                            //         : null
                            }
                    />
                
                
                
                    <TextField
                        className={classes.actionCard}
                        id="building-no"
                        label="Building Number"
                        variant="outlined"
                        onChange={handleBuildingNumInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Building")
                            }
                    />
                
                
                
                    <TextField
                        className={classes.actionCard}
                        id="street"
                        label="Street"
                        variant="outlined"
                        onChange={handleStreetAddInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Street")
                            }
                    />
                
                
                
                    <TextField
                        className={classes.actionCard}
                        id="unit-no"
                        label="Unit Number"
                        variant="outlined"
                        onChange={handleUnitNumInput}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Unit")
                            }
                        />
                
                
                <TextField
                    className={classes.actionCard}
                        id="postal-code"
                        label="Postal Code"
                        variant="outlined"
                        onChange={handlePostalCode}
                        error={state.errorMessages.length !== 0}
                        helperText={state.errorMessages.length === 0 
                            ? null 
                            : findError(state.errorMessages, "Postal")
                            }
                    />
                
                
                    <FormControl className={classes.actionCard}>
                        <InputLabel 
                                id="city" 
                                variant="outlined"
                                >
                            City
                            </InputLabel>
                        <Select
                            id="city"
                            label="City"
                            variant="outlined"
                            value={undefined}
                            onChange={handleCityInput}
                            error={state.errorMessages.length !== 0}
                            helperText={state.errorMessages.length === 0 
                                ? null 
                                : findError(state.errorMessages, "City")
                                }
                        >
                            <MenuItem value={'Singapore'}>
                                Singapore
                            </MenuItem>
                        </Select>
                        <FormHelperText error>{findError(state.errorMessages, "City")}</FormHelperText>
                    </FormControl>
                
                
                
                    <FormControl className={classes.actionCard}>
                        <InputLabel 
                            id="country" 
                            variant="outlined"
                            >
                        Country
                        </InputLabel>
                    <Select
                        id="country"
                        label="Country"
                        value={undefined}
                        variant="outlined"
                        onChange={handleCountryInput}
                        error={state.errorMessages.length !== 0}
                    >
                        <MenuItem value={'Singapore'}>
                            Singapore
                        </MenuItem>
                    </Select>
                    <FormHelperText error>{findError(state.errorMessages, "Country")}</FormHelperText>
                    </FormControl>
                    <FormHelperText>Service is only available in Singapore</FormHelperText>

                
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
        marginBottom: theme.spacing(1.5),
    },
    actionButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    add: {
        background: '#09203f',
        border: 0,
        boxShadow: '0 3px 5px 2px rgba(200, 200, 255, .3)',
        color: 'white',
        borderRadius: 10,
    },
    select: {
        minWidth: '200px',
    },
    formControl: {
        margin: theme.spacing(1),
        display: 'flex',
      },
  }));

export default AddressForm;