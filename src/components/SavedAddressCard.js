import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import List from '@material-ui/core/List';
import ListIcon from '@material-ui/icons/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SavedAddress from './SavedAddress.js';
import Typography from '@material-ui/core/Typography';

const SavedAddressCard = (props) => {
    const classes = useStyles();
    const [state, setState] = useState({
        open: false,
    })

    const toggleDrawer = (open) => {
        if (open) {
            setState({ open: open });
        } else {
            setState({ open: false });
        }
    }

    const savedAddressList = () => {
        return (
            <List>
                <ListSubheader className={classes.buttonHeader} color="inherit">Your Saved Addresses</ListSubheader>
                <ListItem button key={SavedAddress().name} onClick={() => selectedAddress()}>
                    <ListItemIcon><LocationOnIcon /></ListItemIcon>
                    <ListItemText
                        primary={SavedAddress().name}
                        secondary={SavedAddress().address + ', ' + SavedAddress().postalCode} />
                </ListItem>
            </List>
        );
    }

    const selectedAddress = () => {
        toggleDrawer(false);
        props.onClick();
    }

    return (
        <div>
            <React.Fragment key={SavedAddress().name}>
                <Box borderRadius="10%">
                    <Button
                        startIcon={<ListIcon />}
                        onClick={() => toggleDrawer(true)}
                        size="large"
                    >
                        <Typography variant="h6" className={classes.buttonHeader}> Saved Addresses
                        </Typography>
                    </Button>
                </Box>
                <Drawer
                    anchor='bottom'
                    open={state.open}
                    variant='temporary'
                    onClose={() => toggleDrawer(false)}>
                    {savedAddressList()}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    buttonHeader: {
        textTransform: 'capitalize',
        fontWeight: 'bold',
    }
})

export default SavedAddressCard;