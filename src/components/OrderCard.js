import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

export default function OrderCard() {
    const classes = useStyles();
      return (
          <Card className={classes.root}>
              <div className={classes.alignItemsAndJustifyContent}>
                    <CardMedia image='drone.png' className={classes.droneIcon}/>  
                    <CardActions>
                        <Button 
                            className={classes.actionCard} 
                            variant="contained" 
                            size="large" 
                            color="primary"
                        >
                            Make an Order
                        </Button>
                    </CardActions>
              </div>
          </Card>
      );
}

const useStyles = makeStyles({
    root: {
        maxWidth: 300,
        maxHeight: 300,
        margin: 'auto',
    },
    alignItemsAndJustifyContent: {
        padding: '5%',
        backgroundColor: "#FFC774",
        maxWidth: 300,
    },
    droneIcon: {
        width: 150,
        height: 150,
        margin: 'auto',
        paddingTop: '50%',
    },
    actionCard: {
        margin: 'auto',
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    }
})