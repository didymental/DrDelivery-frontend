import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI} from '../apis/rails-backend';
import axios from 'axios';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
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

const EditableTextField = (props) => {
    console.log(props);
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

const Profile = () => {
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
        console.log(customerAPI + '/' + localStorage.getItem('userID'));
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
        console.log(personalInfo);
        console.log(savedAddresses);
        setProfile({...profile, 
            name: personalInfo.name, 
            email: personalInfo.email, 
            contactNum: personalInfo.contact_no, 
            addresses: savedAddresses
        })

    };

    useEffect(() => {
        savedDetails();
        console.log(profile.name);
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
    console.log(profile.name);

    return (
        <div>
        <AppHeader/>
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
        <Divider/>
        <Box className={classes.profileWrapper}>
            <h2>My Saved Addresses</h2>
            <Container className={classes.addressWrapper}>
            {profile.addresses.map(elem => {
                return (
                    <div className={classes.addressWrapper}>
                        <Typography variant="h5">{elem.name}</Typography>
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
                        </div>
                )
            })}
            </Container>
        </Box>
        <IconButton onClick={() => console.log('click')}>
            <SaveIcon />
            <Typography>Save All Changes</Typography>
        </IconButton>
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
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
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

export default Profile;