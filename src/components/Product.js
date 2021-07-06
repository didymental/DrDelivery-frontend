import React from 'react';
import {makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

const Product = (props) => {
    const classes = useStyles();

    const addToCart = () => {
      const id = props.orderId + 1;
      props.addToCart(props.details, id);
    }

    return (
        <Card className={classes.root} onClick={addToCart}>
          <CardActionArea className={classes.container}>
          <CardMedia 
                image={props.image}
                style={{height: 140}}/>
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
            <Container className={classes.containerBox}>
                {'S$' + props.details.price.toFixed(2)}
              </Container>
            <Button size="small" color="primary" className={classes.addButton}>
                <AddIcon color="primary"/>
                <Typography variant="caption" color="textSecondary" component="p">
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
        //maxHeight: 200,
    },
    footer: {
      display: 'flex'
    },
    containerBox: {
      alignSelf: 'flex-start',
      //
      padding: theme.spacing(0.5),
    },
    addButton: {
      alignSelf: 'flex-end',
    },
    box: {
      margin: 'auto',
    }
}));

export default Product;