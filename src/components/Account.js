import React from 'react';
import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {customerAPI} from '../apis/rails-backend';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Box from '@material-ui/core/Box';
import AppHeader from './AppHeader';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import EditableTextField from './EditableTextField';
import EditAddress from './EditAddress';
import AddressForm from './AddressForm';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';


const Transition = React.forwardRef( (props, ref) => {
    return <Slide direction="up" ref={ref} {...props}/>;
});

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Account = (props) => {
    const matches = useMediaQuery('(min-width: 769px)');
    const [profile, setProfile] = useState({
        email: '',
        name: '',
        contactNum: '',
    });
    
    const history = useHistory();
    const [editProfile, setEditProfile] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [editAddress, setEditAddress] = useState([]);

    const [del, setDel] = useState(false);

    const [success, setSuccess] = useState(false);
    const [delSuccess, setDelSuccess] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState([]);

    const [loadingAddress, setloadingAddress] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const classes = useStyles();

    const savedDetails = async () => {
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userID');
        axios.get(customerAPI + '/' + userid, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            const personalInfo = response.data;
            setProfile({...profile, 
                name: personalInfo.name, 
                email: personalInfo.email, 
                contactNum: personalInfo.contact_no, 
            })
            setLoadingProfile(false);
        }).catch(err => {
            setError([...error, err.response.data.message]);;
        });

        axios.get(customerAPI + '/' + userid + '/addresses', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => {
            const savedAddresses = res.data.sort((i, j) => i.id - j.id);
            setAddresses(savedAddresses);
            setEditAddress(savedAddresses.map(i => false));
            setloadingAddress(false);
        });
        
    };

    const [addAddressOpener, setAddAddressOpener] = useState(false);


    useEffect(() => {
        let active = true;
        if (active) {
            savedDetails();
        }
        
        return () => {
            active = false;
        }
    }, [success, delSuccess, addSuccess]);

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
            setError([...error, err.response.data.message]);;
        });
    }

    const handleClose = () => {
        setOpen(false);
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
            if (response.status === 204) {
                handleLogout();
                window.location.reload();
            }
        }).catch(err => {
            setOpen(true);
            setSuccess(false);
        });
    }

    const deleteAddress = (add) => {
        axios.delete(customerAPI + '/' + localStorage.getItem('userID') + '/addresses/' + add.id, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            if (response.status === 204) {
                setDelSuccess(!delSuccess);
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
            {loadingProfile ? <CircularProgress 
                        size={50} 
                        color="secondary"
                        className={classes.progress}
                    /> 
                    :
                    <Box >
                        <Box border={0.5} borderRadius={5} className={classes.profileWrapper}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                        <Typography variant="h4"> 
                                            <Box fontWeight="fontWeightBold">
                                                {profile.name} 
                                            </Box>
                                        </Typography>
                                    
                                </Grid>
                                <Grid item xs={10}>
                                        <Grid 
                                            container
                                            spacing={2}
                                        >
                                            <Grid item>
                                                <Typography variant="body1">Email: {profile.email}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1">Contact Number: {profile.contactNum}</Typography>
                                            </Grid>
                                        </Grid>
                                </Grid>
                                <Grid item>
                                    {
                                        editProfile 
                                        ? <Button 
                                            variant="outlined" 
                                            className={classes.saveButton}
                                            onClick={() => {
                                                setEditProfile(false)
                                                handleProfileChange();
                                            }}
                                        >
                                                <IconButton className={classes.saveIcon}>
                                                <SaveIcon/>
                                                </IconButton>
                                                Save Changes
                                            </Button>
                                        : <Button 
                                        variant="outlined" 
                                        className={classes.editButton}
                                        onClick={() => setEditProfile(true)}
                                    >
                                            <IconButton className={classes.editButton}>
                                            <EditIcon/>
                                            </IconButton>
                                            Edit Profile Details
                                        </Button>

                                    }
                                    
                                </Grid>
                                {
                                    editProfile 
                                    ? <Grid item xs={12}>
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

                                    : null
                                }
                            </Grid>
                        </Box>
                        
                        <Box border={1} borderRadius={5} className={classes.profileWrapper}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                
                                    <Typography variant="h4"> 
                                        <Box fontWeight="fontWeightBold">
                                            Saved Addresses
                                        </Box>
                                    </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormDialog 
                                    open={addAddressOpener} 
                                    setOpen={setAddAddressOpener} 
                                    handleSuccess={() => setAddSuccess(!addSuccess)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Box display={{sm: 'block', md: 'flex'}}>
                                    {addresses.map( (add, index) => (
                                        <Box flex={1} className={classes.overallWrapper}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="body1">
                                                        <Box >
                                                            {add.name}
                                                        </Box>
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    { 
                                                        editAddress[index]
                                                        ? <Button onClick={() => {
                                                            setEditAddress(editAddress.map( (item, i) => {
                                                                if (i === index){
                                                                    return false;
                                                                } else {
                                                                    return item;
                                                                }
                                                            }
                                                            ));

                                                        }
                                                        }
                                                            className={classes.hideDetails}
                                                        >
                                                            Hide Details
                                                        </Button>
                                                        : <Button 
                                                            onClick={() => {
                                                                setEditAddress(editAddress.map( (item, i) => {
                                                                    if (i === index){
                                                                        return true;
                                                                    } else {
                                                                        return item;
                                                                    }
                                                                }
                                                                ))}
                                                            }
                                                            className={classes.editAddress}

                                                            >
                                                            Edit Details
                                                        </Button>
                                                    }
                                                    <Button 
                                                        onClick={() => deleteAddress(add)}
                                                        className={classes.deleteAddress}
                                                    >
                                                        Delete Address
                                                    </Button>
                                                    
                                                </CardActions>
                                                
                                                {
                                                    editAddress[index]
                                                        ? <CardContent>
                                                            <EditAddress 
                                                                address={add} 
                                                                setSuccess={setSuccess}
                                                                setOpen={setOpen}
                                                                error={error}
                                                                setError={setError}
                                                            />
                                                        </CardContent>
                                                        : null
                                                }
                                            </Card>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                            
                        </Grid>
                        </Box>
                        <Button onClick={() => {
                            setDel(true);
                            
                        }} className={classes.deleteButtonWrapper}>
                            <Grid 
                                container
                                direction="row"
                                //spacing={1}
                            >
                                <Grid 
                                    item
                                    xs={2}
                                >
                                    <Container>
                                    <DeleteIcon className={classes.deleteButton}/>
                                    </Container>
                                </Grid>
                                

                                <Grid 
                                    item
                                    
                                >
                                    <Container>
                                    <Typography variant="body1">
                                        <Box fontWeight="fontWeightMedium" className={classes.deleteButton}>
                                            Delete Account
                                        </Box> 
                                    </Typography>
                                    </Container>
                                </Grid>
                            </Grid>
                        </Button>
                    </Box>
}
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
                                        : error.reduce( (acc, curr_value) => acc + '\n' + curr_value, '')}
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
                     className={classes.addAddress}
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
         </div>
    )

}

const useStyles = makeStyles((theme) => ({
    profileWrapper: {
        marginBottom: theme.spacing(4),
        padding: theme.spacing(2),
        display: 'flex',
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
        //display: 'flex',
        // alignSelf: 'flex-start',
        color: 'white',
        background: '#1AA260',
        padding: theme.spacing(0.5),
    },
    overallWrapper: {
        margin: theme.spacing(2),
    },
    saveButtonWrapper: {
        background: '#4285F4'
    },
    saveIcon: {
        color: 'white',
        padding: theme.spacing(0.5),
    },
    deleteButtonWrapper: {
        background: 'red',
    },
    endButtonWrapper: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    progress: {
        margin: 'auto',
        display: 'flex',
        padding: theme.spacing(2),
    },
    paperWrap: {
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    mobilePaperWrap: {
        marginRight: theme.spacing(10),
        paddingBottom: theme.spacing(2),
    },
    editButton: {
        padding: theme.spacing(0.5),
        borderColor: '#1AA260',
        color: '#1AA260',
    },
    editAddress: {
        color: '#1AA260',
        margin: theme.spacing(1),
    },
    deleteButton: {
        color: 'white',
        display: 'flex',
    },
    deleteAddress: {
        color: 'red',
        margin: theme.spacing(1),
    },
    addAddress: {
        // color: '#1AA260',
        color: '#007AFF',
        margin: theme.spacing(1),
    },
    hideDetails: {
        margin: theme.spacing(1),
    }
  }));

export default Account;