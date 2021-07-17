import React from 'react';
import {useState} from 'react';
import clsx from 'clsx';

import PastOrdersProducts from './PastOrdersProducts';


import {makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import OrderCollectedButton from './OrderCollectedButton';

const PastOrderCard = (props) => {
    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();

    const merchantName = props.merchantName;
    const totalPrice = props.totalPrice;
    const date = props.date;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    }


    return (
        
            <Box className={classes.cardDetails}>
                <Box className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {merchantName}
                    </Typography>
                </Box>
                <Box >
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
                    {props.status === 'awaiting_customer_pickup' ? <OrderCollectedButton orderID={props.orderID}/> : null}
                    
                    
                </Box>
                <Collapse in={expanded} unmountOnExit>
                        <PastOrdersProducts merchantID={props.merchantID} orderEntries={props.orderEntries} />
                </Collapse>
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
}));

export default PastOrderCard;