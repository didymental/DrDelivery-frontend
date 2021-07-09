import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI} from '../apis/rails-backend';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from "@material-ui/core/InputAdornment";
import SaveIcon from '@material-ui/icons/Save';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import AppHeader from './AppHeader';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';

const EditableTextField = (props) => {
    const [state, setState] = useState({
        editMode: false,
    })
    
    const classes = useStyles();

    useEffect(() => {

    }, [state.editMode])

    return (
        <Container className={classes.container}>
            <div>
            <Typography variant="h6">
                {props.name}
            </Typography>
            <div>
            </div>
            <TextField
                // defaultValue={props.value}
                id={props.name}
                label={props.value}
                
                margin="normal"
                // error={props.isError}
                onChange={props.handleChange}
                disabled={!state.editMode}
                className={classes.textField}
                // onMouseOver={()=> {console.log('handle mouse over')}}
                // onMouseOut={() => {console.log('handle mouse out')}}
                InputProps={{
                    // classes: {
                    //     disabled: classes.disabled
                    // },
                    endAdornment:
                        
                    <InputAdornment position="end">
                        <IconButton onClick={() => setState({...state, editMode: true})}>
                            <EditIcon />
                        </IconButton>
                        </InputAdornment>
                }}
            
            />
            
            </div>

        </Container>
    )
}

const Account = (props) => {
    const [profile, setProfile] = useState({
        email: '',
        password: '',
        name: '',
        contactNum: '',
        addresses: [],
    })

    const classes = useStyles();

    const savedDetails = async () => {
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userID');
        const response = await axios.get(customerAPI + '/' + userid, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        const addressResponse = await axios.get(customerAPI + '/' + userid + '/addresses', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        const personalInfo = await response.data;
        const savedAddresses = await addressResponse.data;
        setProfile({...profile, 
            name: personalInfo.name, 
            email: personalInfo.email, 
            contactNum: personalInfo.contact_no, 
            addresses: savedAddresses
        })

    };

    useEffect(() => {
        savedDetails();
    }, []);

    const handleNameChange = (input) => {
        setProfile({...profile, name: input.target.value});
    }
    const handleEmailChange = (input) => {
        setProfile({...profile, email: input.target.value});
    }
    const handleNumChange = (input) => {
        setProfile({...profile, contactNum: input.target.value});
    }

    const handleProfileChange = () => {
        

    }
    const handleAddressChange = () => {

    }

    const saveChanges = () => {
        handleProfileChange();
        handleAddressChange();
    }

    return (
        <div>
        <AppHeader handleLogout={props.handleLogout} setOrder={props.setOrder}/>
        <Box borderRadius={10} className={classes.profileWrapper}>
            <h2>Personal Details </h2>
            <EditableTextField 
                name={'Name'} 
                value={profile.name}
                handleChange={handleNameChange} />
            <EditableTextField
                name={'Email'}
                value={profile.email}
                handleChange={handleEmailChange}/>
            <EditableTextField
                name={'Contact Number'}
                value={profile.contactNum}
                handleChange={handleNumChange}/>
        </Box>

        {/* <Grid container spacing={1}>
              {products.map(elem => (
                <Grid
                item xs={3}
                className={classes.container}>
                    <Product details={elem} addToCart={addToCart} removeFromCart={removeFromCart} orderId={orderId}/>
                </Grid>))}
            </Grid> */}
        <Divider/>
        <Box className={classes.profileWrapper} >
            <h2>My Saved Addresses</h2>
            <Container className={classes.addressWrapper}>
                <Grid container spacing={1}>
            {profile.addresses.map(elem => {
                return (
                    <Grid 
                        item xs={3}
                        className={classes.container}>
                            <EditableTextField
                            name={'Name'}
                            value={elem.name}
                        />
                            <EditableTextField
                            name={'Building Number'}
                            value={elem.building_no}
                        />
                        <EditableTextField
                            name={'Street Address'}
                            value={elem.street_address}
                        />
                        <EditableTextField
                            name={'Unit Number'}
                            value={elem.unit_number}
                        />
                        <EditableTextField
                            name={'Postal Code'}
                            value={elem.postcode}
                        />
                        <EditableTextField
                            name={'City'}
                            value={elem.city}
                        />
                        <EditableTextField
                            name={'Country'}
                            value={elem.country}
                        />
                    </Grid>
                )
            })}
            </Grid>
            </Container>
        </Box>
        <IconButton onClick={() => console.log('click')}>
            <SaveIcon />
            <Typography>Save All Changes</Typography>
        </IconButton>
        {/* <IconButton onClick={() => console.log('click')}>
            <DeleteIcon />
            <Typography>Delete Account</Typography>
        </IconButton> */}
        </div>);
}

const useStyles = makeStyles((theme) => ({
    profileWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(5),
        minWidth: '330px',
        minHeight: '50vh',
        // boxShadow: '0 3px 5px 2px rgba(135, 105, 235, .3)',
    },
    container: {
        display: 'fixed',
        padding: theme.spacing(2),
    },
    addressWrapper: {
        display: 'fixed',
        justifyContent: 'space-evenly',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        //width: 300,
        color: 'black',
        fontSize: 24,
        opacity: 1,
    },
    disabled: {
        color: 'black',
        borderBottom: 0,
        btnIcons: {
            marginLeft: 10,
        }
    }
  }));

export default Account;