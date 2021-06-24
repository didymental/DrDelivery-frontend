import React from 'react';
import {useState} from 'react';
import {makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Product from './Product';

const Cart = (props) => {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const classes = useStyles();

    const total = () => {
        let totalVal = 0;
        for (let i = 0; i < cart.length; i++) {
            totalVal += cart[i].price;
        }
        setCartTotal(totalVal);
    }

    const addToCart = (item) => {
        setCart([...cart, item]);
    }

    const removeFromCart = (item) => {
        let cartCopy = cart.filter((order) => order.uniqueID !== item.uniqueID);
        setCart(cartCopy);
    }

    const cartItems = () => { // to do
        cart.map(item => (
            <div>Making...</div>
        ));
    }

    return (
        <Box className={classes.cartContainer}>
            <Product/>
        </Box>
    )



}

const useStyles = makeStyles((theme) => ({
    cartContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),
      width: 352,
    },
    cartItemsWrapper: {

    },
    cartSummaryFooter: {

    },
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    }

}));

export default Cart;