import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import Cart from './Cart';
import {loginAPI, merchantAPI} from '../apis/rails-backend';
import {makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Product from './Product';
import Container from '@material-ui/core/Container';

const ProductDisplay = (props) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orderId, setOrderId] = useState(0);

    const addToCart = (item, orderId) => {
        const toAdd = {...item, orderId: orderId};
        setCart([...cart, toAdd]);
        setOrderId(orderId);
    }

    const removeFromCart = (item) => {
        let cartCopy = cart.filter((order) => order.id !== item.id);
        let toDelete = cart.filter((order) => order.id === item.id);
        for (let i = 0; i < toDelete.length - 1; i++) {
          cartCopy = [...cartCopy, toDelete[i]];
        }
        setCart(cartCopy);
    }


    const classes = useStyles();

    const getAdminToken = async () => {
        const adminLogin = {
          email: 'example@railstutorial.org',
          password: 'foobar'
        };
    
        const response = await axios.post(loginAPI, adminLogin, {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
        });
        return response.data.token;
    };
    
    const getProducts = async () => {
        const token = await getAdminToken();
        axios.get(merchantAPI + '/' + props.id + '/products', {
          headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
          }
        }).then(response => {
          let productList = [...response.data];
          setProducts([...productList]);
        });
    };
    
    useEffect(() => {
        getProducts();
    }, []);


    return (
      <div>
        <Container>
          <Box className={classes.productsWrapper}>
            <Grid container spacing={1}>
              {products.map(elem => (
                <Grid
                item xs={3}
                className={classes.container}>
                    <Product details={elem} addToCart={addToCart} removeFromCart={removeFromCart} orderId={orderId}/>
                </Grid>))}
            </Grid>
          </Box>
        </Container>
        <Container className={classes.cartOuterWrapper}>
            <Box className={classes.cartWrapper}>
              <Cart 
                cart={cart} 
                addToCart={addToCart} 
                removeFromCart={removeFromCart} 
                handleNext={props.handleNext}
                handleOrder={props.handleOrder}
              />
            </Box>
        </Container>
      </div>
      
    )
}

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',      
    },
    outerWrapper: {
      display: 'flex',
    },
    productsWrapper: {
      display: 'flex',
      padding: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    cartWrapper: {
      display: 'flex',
      padding: theme.spacing(1),
      borderRadius: 5,
    },
    cartOuterWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: '#09203f',
      color: 'white',
      padding: theme.spacing(1),
    }
}));

export default ProductDisplay;