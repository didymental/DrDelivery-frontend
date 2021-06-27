import React from 'react';
import {makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

const Product = (props) => {
    const classes = useStyles();

    const addToCart = () => {
      const id = props.orderId + 1;
      props.addToCart(props.details, id);
    }

    return (
        <Card className={classes.root}>
          <CardActionArea className={classes.container}>
            <CardContent >
              <Typography gutterBottom variant="body1" component="h2">
                {props.details.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {props.details.description}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.footer}>
            <Button size="small" color="primary" onClick={addToCart} className={classes.addButton}>
                <AddIcon color="primary"/>
                <Typography variant="body3" color="textSecondary" component="p">
                    Add
                </Typography>
            </Button>
          </CardActions>
        </Card>
      );

};

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    container: {
        maxHeight: 175,
    },
    footer: {
      display: 'flex'
    },
    addButton: {
      alignSelf: 'flex-start',
    },
    removeButton: {
      alignSelf: 'flex-end',
    }
}));

export default Product;