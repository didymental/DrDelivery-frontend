import React from 'react';
import useState from 'react';
import {makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const Product = (props) => {
    console.log(props);
    const classes = useStyles();

    return (
        <Card className={classes.root}>
          <CardActionArea className={classes.container}>
            {/* <CardMedia
              className={classes.media}
            //   image={props.item.image ? props.item.image : null}
              title={'to fill'}
            /> */}
            <CardContent >
              <Typography gutterBottom variant="body1" component="h2">
                {props.details.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {props.details.description}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.container}>
            <Button size="small" color="primary" onClick={props.addToCart}>
                <AddIcon color="primary"/>
                <Typography variant="body3" color="textSecondary" component="p">
                    Add To Cart
                </Typography>
            </Button>
            <Button size="small" color="primary" onClick={props.removeFromCart}>
                <RemoveIcon color="primary"/>
                <Typography variant="body3" color="textSecondary" component="p">
                    Remove From Cart
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
    }
}));

export default Product;