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
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

const ShoppingCartBadge = (props) => {
    const classes = useStyles();
    return (
            <Badge className={classes.badge} badgeContent={props.count} color="secondary">
                <ShoppingCartIcon className={classes.cartIcon}/>
            </Badge>
      
    );
}

const CheckOutButton = (props) => {
    const classes = useStyles();
    const handleClick = () => {
        if (props.cart.length === 0) {

        } else {
            props.handleOrder(props.orderToPost());
        }
    }

    return (
        
        
            <Button disabled={props.cart.length === 0} onClick={handleClick} className={classes.cartCheckOutWrapper}>
                <Tooltip title={props.cart.length === 0 ? "Add items to your cart" : ""}>
                    <Typography 
                        variant="body1"
                        component="div"
                    >
                        CHECKOUT NOW
                    </Typography>
                </Tooltip>
            </Button>
        
        
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
        const items = props.cart.map(x => x);
        let unique = {};
        for (let i = 0; i < items.length; i++) {
            const name = items[i].name;
            if (unique[name]) {
                unique[name][0]++;
                // unique = {...unique, name: [unique[name][0]++, unique[name][1]]}

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
                        <ListItem key={elem.name}>
                            <ListItemText primary={elem.name}/>
                            <Button size="small" color="primary" onClick={() => props.removeFromCart(elem)} className={classes.removeButton} item={elem}>
                                <RemoveIcon className={classes.removeIcon}/>
                            </Button>
                            <div> 
                                {countPerItem()[elem.name][0]}
                            </div>
                            <Button size="small" color="primary" onClick={() => props.addToCart(elem, props.cart.length + 1)} className={classes.addButton}>
                                <AddIcon className={classes.addIcon}/>
                            </Button>
                        </ListItem>
                    )
                }
            ))}
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

        // Remove duplicates from arr
        arr.sort((a, b) => a.product_id - b.product_id);
        let arrCopy = [...arr];
        let noDuplicateArr = [];
        let i = 0; 
        while (i < arr.length) {
            const nonUniqArr = arrCopy.filter(x => x.product_id === arr[i].product_id);
            const uniqItem = nonUniqArr[0];
            i += nonUniqArr.length;
            noDuplicateArr = [...noDuplicateArr, uniqItem];
        }

        return [noDuplicateArr, cartTotal.toFixed(2)];
    }

    useEffect(() => {
        total();
        countPerItem();
    }, [total, countPerItem]);

    return (
        <div className={classes.cartContainer}>
            <h2>
                Your Cart
                <ShoppingCartBadge count={props.cart.length}/>
            </h2>
            {
                props.cart.length === 0 
                    ? null 
                    : <Box>
                        <Paper>
                            {cartItems()}
                        </Paper>
                    </Box>
            }
            
            <Box className={classes.totalWrapper}>
                <Typography 
                            variant="body1" 
                            component="p"
                        >
                            {'Total bill: S$ ' + cartTotal.toFixed(2)}
                </Typography>
            </Box>

            <Box className={classes.dividerWrapper}>
                <Divider  className={classes.divider}/>
            </Box>

            <Box className={classes.buttonWrapper}>
                <CheckOutButton 
                    handleNext={props.handleNext} 
                    cart={props.cart} 
                    handleOrder={props.handleOrder}
                    orderToPost={orderToPost}/>
                
            </Box>
            
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
      minHeight: '50vh',
    },
    cartItemsWrapper: {
        display: 'fixed',
        padding: theme.spacing(1),
    },
    cartCheckOutWrapper: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        padding: theme.spacing(1.5),
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonWrapper: {
        display: 'flex',
        padding: theme.spacing(1),
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
      alignSelf: 'center',
    },
    removeButton: {
      alignSelf: 'center',
    },
    icon: {
        color: 'black',
    },
    addIcon: {
        color: '#1AA260',
    },
    removeIcon: {
        color: '#DB4437',
    },
    divider: {
        background: 'white',
    },
    dividerWrapper: {
        marginTop: '5px',
        padding: theme.spacing(0.5),
    },
    totalWrapper: {
        padding: theme.spacing(1),
    }, 
    cartIcon: {
        color: '#FFDC80',
    }
}));

export default Cart;