import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import clsx from 'clsx';

import PastOrdersProducts from './PastOrdersProducts';
import {customerAPI} from '../apis/rails-backend';

import {makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

const Transition = React.forwardRef( (props, ref) => {
    return <Slide direction="up" ref={ref} {...props}/>;
})

const PastOrderCard = (props) => {
    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const merchantName = props.merchantName;
    const totalPrice = props.totalPrice;
    const date = props.date;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    }

    const handleChipClick = () => {
        const token = localStorage.getItem('token');
        axios.post(customerAPI + '/' + localStorage.getItem('userID') + '/orders/' + props.orderID + '/customerCollectOrder', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
          }).then(response => {
              if (response.statusText === "OK") {
                const getPastOrders = async () => {
                    const token = localStorage.getItem('token');
                    const userid = localStorage.getItem('userID');
                    const orderResponse = await axios.get(customerAPI + '/' + userid + '/orders/', {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    props.setPastOrders([...orderResponse.data].sort((i,j) => i.id - j.id));
                }
                getPastOrders();  
              } else {
                  setOpen(true);
              }
          }).catch(error => {
              setOpen(true);
          });
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        
            <Box className={classes.cardDetails}>
                <Box className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {merchantName}
                    </Typography>
                </Box>
                <Box className={classes.beforeTable}>
                    <Grid 
                        container 
                        direction="row"
                        alignItems="flex-end"
                        spacing={1}
                    > 
                        <Grid 
                            item
                            xs
                            className={classes.gridItem}
                            >
                            <Typography variant="subtitle1" color="textSecondary">
                                {date.slice(0, 10)}
                            </Typography>
                        </Grid>
                        <Grid 
                            item 
                            xs
                            className={classes.gridItem}
                            >
                            <Typography variant="subtitle1" color="textSecondary">
                                {'Total: S$ ' + totalPrice}
                            </Typography>
                        </Grid>
                        
                        <Grid
                            item
                            className={classes.gridItem}>
                            <IconButton 
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: expanded,
                                })}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                    
                    {props.status === 'awaiting_customer_pickup' 
                        ? <Chip
                            icon={<DoneIcon className={classes.doneIcon}/>}
                            size="small"
                            label="Collect Order"
                            onClick={handleChipClick}
                            className={classes.chip}
                            /> 
                        : <Chip
                            icon={<ShoppingBasketIcon className={classes.doneIcon}/>}
                            size="small"
                            label="Order Collected"
                            className={classes.pastOrderChip}
                            /> }
                    
                    
                </Box>
                <Collapse in={expanded} unmountOnExit>
                        <PastOrdersProducts 
                            merchantID={props.merchantID} 
                            orderEntries={props.orderEntries}
                        />
                </Collapse>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                >
                    <DialogTitle id="title">
                            Oh no... we encountered an error...
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                We checked and there are no orders in our system. Contact our hotline if this is a mistake.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>
                                Acknowledge
                            </Button>
                        </DialogActions>
                </Dialog>
            </Box>
                
    )
}

const useStyles = makeStyles((theme) => ({
    cardDetails: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px'
    },
    dateWrapper: {
        marginRight: 'auto',
    },
    gridWrapper: {
        marginLeft: 'auto'
    },
    gridItem: {
        //display: 'flex',
        alignSelf: 'center',
    },
    content: {
        flex: '1 0 auto',
    },
    expand: {
        transform: 'rotate(0deg)',
        //marginLeft: 'auto',
        alignSelf: 'flex-end',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    chip: {
        background: '#FF9068',
        color: 'white',
        fontWeight: 'bold',

    },
    doneIcon: {
        color: 'white',
    },
    pastOrderChip: {
        background: '#1AA260',
        color: 'white',
        fontWeight: 'bold',
    },
    beforeTable: {
        marginBottom: theme.spacing(2),
    }
}));

export default PastOrderCard;