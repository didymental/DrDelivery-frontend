import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

const OrderCard = (props) => {
    
    const classes = useStyles();
    return (
        <div>
        <Card className={classes.root}>
            <div className={classes.alignItemsAndJustifyContent}>
                <CardMedia image='drone.png' className={classes.droneIcon}/>  
                <Link to="/order/address">
                    <CardActions>
                        <Button 
                            className={classes.actionCard} 
                            variant="contained" 
                            size="small" 
                            color="primary">
                            Make an Order   
                        </Button>
                    </CardActions>
                </Link>
            </div>
        </Card>
        </div>
    );
}

const useStyles = makeStyles( (theme) => ({
    root: {
        maxWidth: 150,
        maxHeight: 150,
        margin: 'auto',
        borderRadius: '8%',
    },
    alignItemsAndJustifyContent: {
        padding: '5%',
        backgroundColor: "#FFC774",
        maxWidth: 150,
    },
    droneIcon: {
        width: 75,
        height: 75,
        margin: 'auto',
        marginTop: theme.spacing(0.1),
        paddingTop: '50%',
    },
    actionCard: {
        margin: 'auto',
        marginTop: theme.spacing(3),
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    }
}))

export default OrderCard;