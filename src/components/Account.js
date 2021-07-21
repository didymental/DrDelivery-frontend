import React from 'react';
import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {customerAPI} from '../apis/rails-backend';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from "@material-ui/core/InputAdornment";
import SaveIcon from '@material-ui/icons/Save';
import Box from '@material-ui/core/Box';
import AppHeader from './AppHeader';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CheckIcon from '@material-ui/icons/Check';


const Transition = React.forwardRef( (props, ref) => {
    return <Slide direction="up" ref={ref} {...props}/>;
});

const EditableTextField = (props) => {
    const [state, setState] = useState({
        editMode: false,
    })
    const [text, setText] = useState(null);
    const [editCount, setEditCount] = useState(0);
    
    const classes = useStyles();

    useEffect(() => {
        

    }, [state.editMode])

    const handleChange = (input) => {
        setEditCount(editCount+1);
        setText(input.target.value);
    }

    const handleSave = () => {
        setState({...state, editMode: false});
        props.handleChange(text);
    }
 
    return props.name === 'Email' 
        ? (
            <Box className={classes.container}>
                <div>
                <Typography variant="h6">
                    {props.name}
                </Typography>
                <div>
                </div>
                <TextField
                    id={props.name}
                    value={props.value}
                    margin="normal"
                    // error={props.isError}
                    //onChange={handleChange}
                    disabled={true}
                    //className={classes.textField}
                />
                
                </div>
    
            </Box>
        )
        : (
        <Box className={classes.container}>
            <div>
            <Typography variant="h6">
                {props.name}
            </Typography>
            <div>
            </div>
            <TextField
                id={props.name}
                value={editCount === 0 ? props.value : text}
                margin="normal"
                // error={props.isError}
                onChange={handleChange}
                disabled={!state.editMode}
                //className={classes.textField}
                
                InputProps={{
                    endAdornment:
                    <InputAdornment position="end">
                        {!state.editMode 
                            ? (
                                <IconButton onClick={() => setState({...state, editMode: true})}>
                                    <EditIcon />
                                </IconButton>
                            )
                            : (
                                <div>
                                    <IconButton >
                                        <SettingsBackupRestoreIcon onClick={()=> {setEditCount(0)}}/>
                                    </IconButton>
                                    <IconButton onClick={handleSave}>
                                        <CheckIcon/>
                                    </IconButton>
                                </div>
                            )
                        }
                        </InputAdornment>
                }}
            />
            </div>
        </Box>
    )
}

const Account = (props) => {
    const matches = useMediaQuery('(min-width: 769px)');
    const [profile, setProfile] = useState({
        email: '',
        name: '',
        contactNum: '',
    });
    const history = useHistory();

    const [addresses, setAddresses] = useState([]);
    const [addressIDs, setAddressIDs] = useState(new Map());

    const [del, setDel] = useState(false);

    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState([]);

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
        })
        setAddresses(savedAddresses);
        
    };

    function searchAddress(id, arr) {
        
        arr.sort((i, j) => i.id - j.id);
        if (arr.length === 0) {
            return null;
        } else {
            let len = arr.length;
            let start = 0;
            let end = len - 1;
            
            while (start < end) {
                let mid = start + Math.floor((end - start)/2);
                if (id <= arr[mid].id) {
                    end = mid;
                } else {
                    start = mid + 1;
                }
            }

            if (arr[start].id === id) {
                return start;
            }

        }
    }

    

    useEffect(() => {
        savedDetails();
    }, []);

    const handleNameChange = (input) => {
        setProfile({...profile, name: input});
    }
    const handleEmailChange = (input) => {
        setProfile({...profile, email: input});
    }
    const handleNumChange = (input) => {
        setProfile({...profile, contactNum: input});
    }

    const handleProfileChange = () => {
        let toPost = {
            name: '',
            contact_no: '',
            email: '',
        };

        toPost = {...toPost, 
            name: profile.name, 
            contact_no: profile.contactNum, 
            email: profile.email,
        }

        axios.patch(customerAPI + '/' + localStorage.getItem('userID'), toPost, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if (response.statusText === "OK") {
                setOpen(true);
                setSuccess(true);
            }
        }).catch(err => {
            setOpen(true);
            setSuccess(false);
            setError([...error, err.message]);
        });
    }
    const handleAddressChange = () => {
        const arrAddressID = Array.from(addressIDs.keys());
        

        for (let i = 0; i < addressIDs.size; i++)  {
            
            let toPost = {
                street_address: '',
                city: '',
                country: '',
                postcode: '',
                building_no: '',
                unit_number: '',
                name: '',
            }
            const index = searchAddress(arrAddressID[i], addresses);
            
            toPost = {...toPost, 
                street_address: addresses[index].street_address,
                city: addresses[index].city,
                country: addresses[index].country,
                postcode: addresses[index].postcode,
                building_no: addresses[index].building_no,
                unit_number: addresses[index].unit_number,
                name: addresses[index].name,
            }
            axios.patch(customerAPI + '/' + localStorage.getItem('userID') + '/addresses' + '/' + arrAddressID[i], toPost, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }).then(response => {
                if (response.statusText === "OK") {
                    setOpen(true);
                    setSuccess(true);
                }
            }).catch(err => {
                setOpen(true);
                setSuccess(false);
                setError([...error, err.message]);
            });
        }
        
    }

    const handleClose = () => {
        setOpen(false);
    }

    const saveChanges = () => {
        handleAddressChange();
        handleProfileChange();
    }

    const handleLogout = () => {
        props.setState({
            isLoggedIn: false,
            user: '',
        });
        props.setOrder({...props.order, hasOrder: false});

        localStorage.removeItem('userID');
        localStorage.removeItem('token');
        history.push("/");
    }

    const deleteAccount = () => {
        axios.delete(customerAPI + '/' + localStorage.getItem('userID'), {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if (response.statusText === "OK") {
                handleLogout();
            }
        }).catch(err => {
            setOpen(true);
            setSuccess(false);
        });
    }
    

    return (
        <div>
        <AppHeader 
            setState={props.setState}
            setOrder={props.setOrder}
            order={props.order}
        />
        <Box className={classes.overallWrapper}>
        <Box > 
            <Box className={classes.profileWrapper} >
                <Typography variant="h4">Personal Details </Typography>
                <Grid 
                    container 
                    spacing={1}
                    direction={matches ? "row" : "column"}
                >
                    <Box display={{sm: 'block', md: 'flex'}}>
                        <Box 
                            className={classes.container}
                        >
                            <EditableTextField
                                name={'Email'}
                                value={profile.email}
                                handleChange={handleEmailChange}/>
                        </Box>

                        <Box 
                            
                            className={classes.container}
                        >
                            <EditableTextField 
                                name={'Name'} 
                                value={profile.name}
                                handleChange={handleNameChange} />

                        </Box>

                        <Box 
                            className={classes.container}
                        >
                            <EditableTextField
                                name={'Contact Number'}
                                value={profile.contactNum}
                                handleChange={handleNumChange}/>

                        </Box>
                    </Box>
                </Grid>
            </Box>
            
            <Box className={classes.profileWrapper} >
                <Typography variant="h4">
                    Saved Addresses 
                </Typography>
                <Grid 
                    container 
                    //spacing={1}
                    direction={matches ? "row" : "column"}
                >
                    {addresses.map(elem => {
                        return (
                            
                            <Box display={{sm: 'block', md: 'flex'}}>
                                <Box className={classes.container}>
                                    <EditableTextField
                                    name={'Name'}
                                    value={elem.name}
                                    handleChange={(input) => {
                                        let i = searchAddress(elem.id, addresses);
                                        setAddresses(addresses.map((add, index) => {
                                            if (index === i) {
                                                return {...add, name: input};
                                            } else {
                                                return add;
                                            }
                                        }));
                                        setAddressIDs(addressIDs.set(elem.id, elem.id));
                                    }}
                                    />
                                </Box>
                                <Box className={classes.container}>
                                    <EditableTextField
                                    name={'Building Number'}
                                    value={elem.building_no}
                                    handleChange={(input) => {
                                        let i = searchAddress(elem.id, addresses);
                                        setAddresses(addresses.map((add, index) => {
                                            if (index === i) {
                                                return {...add, building_no: input};
                                            } else {
                                                return add;
                                            }
                                        }));
                                        setAddressIDs(addressIDs.set(elem.id, elem.id));
                                    }}
                                />
                                </Box>
                                <Box className={classes.container} >
                                    <EditableTextField
                                        name={'Street Address'}
                                        value={elem.street_address}
                                        handleChange={(input) => {
                                            let i = searchAddress(elem.id, addresses);
                                            setAddresses(addresses.map((add, index) => {
                                                if (index === i) {
                                                    return {...add, street_address: input};
                                                } else {
                                                    return add;
                                                }
                                            }));
                                            setAddressIDs(addressIDs.set(elem.id, elem.id));
                                        }}
                                    />
                                </Box>
                                <Box className={classes.container}>
                                    <EditableTextField
                                        name={'Unit Number'}
                                        value={elem.unit_number}
                                        handleChange={(input) => {
                                            let i = searchAddress(elem.id, addresses);
                                            setAddresses(addresses.map((add, index) => {
                                                if (index === i) {
                                                    return {...add, unit_number: input};
                                                } else {
                                                    return add;
                                                }
                                            }));
                                            setAddressIDs(addressIDs.set(elem.id, elem.id));
                                        }}
                                    />
                                </Box>
                                <Box className={classes.container} >
                                    <EditableTextField
                                        name={'Postal Code'}
                                        value={elem.postcode}
                                        handleChange={(input) => {
                                            let i = searchAddress(elem.id, addresses);
                                            setAddresses(addresses.map((add, index) => {
                                                if (index === i) {
                                                    return {...add, postcode: input};
                                                } else {
                                                    return add;
                                                }
                                            }));
                                            setAddressIDs(addressIDs.set(elem.id, elem.id));
                                        }}
                                    />
                                </Box>
                                <Box className={classes.container}>
                                    <EditableTextField
                                        name={'City'}
                                        value={elem.city}
                                        handleChange={(input) => {
                                            let i = searchAddress(elem.id, addresses);
                                            setAddresses(addresses.map((add, index) => {
                                                if (index === i) {
                                                    return {...add, city: input};
                                                } else {
                                                    return add;
                                                }
                                            }));
                                            setAddressIDs(addressIDs.set(elem.id, elem.id));
                                        }}
                                    />
                                </Box>
                                <Box className={classes.container}>
                                    <EditableTextField
                                        name={'Country'}
                                        value={elem.country}
                                        handleChange={(input) => {
                                            let i = searchAddress(elem.id, addresses);
                                            setAddresses(addresses.map((add, index) => {
                                                if (index === i) {
                                                    return {...add, country: input};
                                                } else {
                                                    return add;
                                                }
                                            }));
                                            setAddressIDs(addressIDs.set(elem.id, elem.id));
                                        }}
                                    />
                                </Box>
                            </Box>
                            
                        )
                    }
                    )}
                </Grid>
            </Box>
        </Box>

        <Grid 
            container
            direction={matches ? "row" : "column"}
            spacing={4}
        >
            <Grid 
                item
                justifyContent="center"
            >
                <Button onClick={saveChanges} className={classes.saveButtonWrapper}>
                    <Grid 
                        container
                        direction="row"
                        spacing={1}
                    >
                        <Grid 
                            item
                            justifyContent="center"
                        >
                            <SaveIcon className={classes.saveButton}/>
                        </Grid>

                        <Grid 
                            item
                            justifyContent="center"
                        >
                            <Typography variant="body1">
                                <Box fontWeight="fontWeightMedium" className={classes.saveButton}>
                                    Save All Changes
                                </Box> 
                            </Typography>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
            <Grid 
                item
                justifyContent="center"
            >
                <Button onClick={() => {
                    setDel(true);
                    
                }} className={classes.deleteButtonWrapper}>
                    <Grid 
                        container
                        direction="row"
                        spacing={1}
                    >
                        <Grid 
                            item
                            alignItem="center"
                            justifyContent="center"
                        >
                            <DeleteIcon className={classes.saveButton}/>
                        </Grid>

                        <Grid 
                            item
                            alignItem="center"
                            justifyContent="center"
                        >
                            <Typography variant="body1">
                                <Box fontWeight="fontWeightMedium" className={classes.saveButton}>
                                    Delete Account
                                </Box> 
                            </Typography>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
        </Grid>


        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            { success 
                ? 
                    (
                        <div>
                            <DialogTitle id="success">
                                Your Changes are successful 🙌
                            </DialogTitle>
                            {/* <DialogContent>
                                <DialogContentText>
                                    
                                </DialogContentText>
                            </DialogContent> */}
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    Close
                                </Button>
                            </DialogActions>
                        </div>
                    ) 
                    :   
                    (
                        <div>
                            <DialogTitle id="error">
                                Oh no... we encountered an error...
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {error.length === 0 
                                        ? 'Contact our hotline if this is a mistake.'
                                        : error.reduce( (acc, curr_value) => acc + curr_value, '')}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={ () => {
                                        handleClose();
                                        window.location.reload();
                                    }
                                }>
                                    Acknowledge
                                </Button>
                            </DialogActions>
                        </div>
                    )
            } 
        </Dialog>

        <Dialog
            open={del}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setDel(false)}
        >       
            <div>
                <DialogTitle id="delete">
                    We are sad you're leaving 🥺
                    All your information will be erased
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={deleteAccount}
                    > 
                        
                        Confirm
                    </Button>
                </DialogActions>
            </div>    
        </Dialog>
        </Box>
        </div>);
}

const useStyles = makeStyles((theme) => ({
    profileWrapper: {
        marginBottom: theme.spacing(4),
        //display: 'flex',
        //flexDirection: 'column',
        //padding: theme.spacing(3),
        //minWidth: '330px',
        //minHeight: '50vh',
        // boxShadow: '0 3px 5px 2px rgba(135, 105, 235, .3)',
    },
    container: {
        // display: 'flex',
        // flexDirection: 'row',
        //display: 'fixed',
        // padding: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
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
    },
    saveButton: {
        display: 'flex',
        alignSelf: 'center',
        color: 'white',
    },
    overallWrapper: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(5),
    },
    saveButtonWrapper: {
        background: '#4285F4'
    },
    deleteButtonWrapper: {
        background: '#C6C6C6',
    },
    endButtonWrapper: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    }
  }));

export default Account;