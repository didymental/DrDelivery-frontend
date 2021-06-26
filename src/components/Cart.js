import React from 'react';
import {useState, useEffect} from 'react';
import Badge from '@material-ui/core/Badge';
import {makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const ShoppingCartBadge = (props) => {
    const classes = useStyles();
    return (
            <Badge className={classes.badge} badgeContent={props.count} color="secondary">
                <ShoppingCartIcon/>
            </Badge>
      
    );
}

const CheckOutButton = (props) => {
    const classes = useStyles();
    const handleClick = () => {
        props.handleOrder(props.orderToPost());
        props.handleNext();
    }

    return (
        <Container className={classes.cartCheckOutWrapper}>
            <Button onClick={handleClick} disabled={props.cart.length === 0}>
                <Typography 
                    variant="body1"
                    component="div"
                >
                    CHECKOUT NOW
                </Typography>
            </Button>
        </Container>
    )
}

const Cart = (props) => {
    const classes = useStyles();
    const [cartTotal, setCartTotal] = useState(0);

    const total = () => {
      let totalVal = 0;
      for (let i = 0; i < props.cart.length; i++) {
          totalVal += props.cart[i].price;
      }
      setCartTotal(totalVal);
    }

    const countPerItem = () => {
        const items = [...props.cart];
        let unique = {};
        for (let i = 0; i < items.length; i++) {
            const name = items[i].name;
            if (unique[name]) {
                unique[name][0]++;
            } else {
                Object.assign(unique, {[name]: [1, items[i]]});
            }
        }
        return unique;
    }
    
    const objMap = (obj, func) => {
        return Object.fromEntries(Object.entries(obj).map( ([k, v]) => [k, func(v)] ));
    }
    
    const cartItems = () => { 
        return (
            <List>
                {
                Object.values(objMap(countPerItem(), (arr) => {
                    let elem = arr[1];
                    return (
                        <ListItem>
                            <ListItemText primary={elem.name}/>
                            <Button size="small" color="primary" onClick={() => props.addToCart(elem, props.cart.length + 1)} className={classes.addButton}>
                                <AddIcon className={classes.icon}/>
                            </Button>
                            <div> 
                                {countPerItem()[elem.name][0]}
                            </div>
                            <Button size="small" color="primary" onClick={() => props.removeFromCart(elem)} className={classes.removeButton} item={elem}>
                                <RemoveIcon className={classes.icon}/>
                            </Button>
                        </ListItem>
                    )
                }
    ))}
                <ListItem>
                    <Typography 
                        variant="body2" 
                        component="p"
                    >
                        {'Total: S$ ' + cartTotal.toFixed(2)}
                    </Typography>
                </ListItem>
            </List>
        );
    }

    const orderToPost = () => {

        const arr = props.cart.map(elem => {
            const obj = {
                product_id: elem.id,
                units_bought: countPerItem()[elem.name][0],
                total_unit_price: (countPerItem()[elem.name][0] * elem.price).toFixed(2),
            };
            return obj;
        });

        let noDuplicateArr = arr.length > 0 ? [arr[0]] : [];
        for (let i = 1; i < arr.length; i++) {
            if (noDuplicateArr.filter(x => x.product_id !== arr[i].product_id).length > 0) {
                noDuplicateArr = [...noDuplicateArr, arr[i]];
            }
        }

        return noDuplicateArr;
    }

    useEffect(() => {
        total();
        countPerItem();
    }, [props.cart])

    return (
        <div className={classes.cartContainer}>
            <h2>
                Your Cart
                <ShoppingCartBadge count={props.cart.length}/>
            </h2>
            
            {cartItems()}
            <div className={classes.buttonWrapper}>
                <CheckOutButton 
                    handleNext={props.handleNext} 
                    cart={props.cart} 
                    handleOrder={props.handleOrder}
                    orderToPost={orderToPost}/>
            </div>
            
        </div>
    )



}

const useStyles = makeStyles((theme) => ({
    cartContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(0.5),
      minWidth: '330px',
    },
    cartItemsWrapper: {
        display: 'fixed',
        padding: theme.spacing(1),
    },
    cartCheckOutWrapper: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        padding: theme.spacing(0.75),
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonWrapper: {
        display: 'flex',
    },
    media: {
        height: 140,
    },
    badge: {
        left: 10,
        top: -3,
        padding: '0 1px',
        color: '#FFFDD0',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    addButton: {
      alignSelf: 'flex-start',
    },
    removeButton: {
      alignSelf: 'flex-end',
    },
    icon: {
        color: 'white',
    }
}));

export default Cart;