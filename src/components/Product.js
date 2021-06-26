import React from 'react';
import {useState} from 'react';
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
    //const [orderId, setOrderId] = useState(0);
    const classes = useStyles();

    const addToCart = () => {
      const id = props.orderId + 1;
      // setOrderId(id);
      props.addToCart(props.details, id);
    }

    const removeFromCart = () => {
      props.removeFromCart(props.details);
      // const id = orderId - 1;
      //setOrderId(id);
    }
    

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