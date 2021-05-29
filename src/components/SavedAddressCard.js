import React from 'react';
import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SavedAddress from './SavedAddress.js';
import Drawer from '@material-ui/core/Drawer';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const SavedAddressCard = () => {
    const classes = useStyles();
    const [state, setState] = useState({
        open: false,
    })

    const toggleDrawer = (open) => () => {
        if (open) {
            setState({open: open});
        } else {
            setState({open: false});
        }
    }

    const savedAddressList = () => {
        return (
            <List>
                <ListItem button key={SavedAddress().name}>
                    <ListItemIcon><LocationOnIcon/></ListItemIcon>
                        <ListItemText 
                            primary={SavedAddress().name}
                            secondary={SavedAddress().address + ', ' + SavedAddress().postalCode}/>
                </ListItem>
            </List>
        );
    }

    return (
        <div>
            <React.Fragment key={SavedAddress().name}>
                <Button onClick={toggleDrawer(true)}>
                    Saved Addresses
                </Button>
                <Drawer anchor='bottom' open={state.open} onClose={toggleDrawer(false)}>
                    {savedAddressList()}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

const useStyles = makeStyles( {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
})

export default SavedAddressCard;