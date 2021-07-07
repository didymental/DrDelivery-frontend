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
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

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

    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getProducts().then(response => setLoading(false));
    }, []);


    return loading ? <LinearProgress/> : (
      <div className={classes.root}>
        <Container className={classes.merchantWrapper}>
          <Typography variant="h4">
            {props.merchantName}
          </Typography>
          <br/>
          <Divider/>
        </Container>
        <Container>
          <Box display={{sm: 'block', md: 'flex'}}>
            <Box className={classes.productsWrapper} flexGrow={2}>
              <Grid container spacing={1}>
                {products.map(elem => (
                  <Grid
                  item xs={3}
                  className={classes.container}
                  key={elem.id}>
                      <Product 
                        details={elem} 
                        addToCart={addToCart} 
                        removeFromCart={removeFromCart} 
                        orderId={orderId}
                        image={'https://source.unsplash.com/random'}/>
                  </Grid>))}
              </Grid>
            </Box>
          
            <Box className={classes.cartWrapper} flexGrow={1}>
              <Cart 
                cart={cart} 
                addToCart={addToCart} 
                removeFromCart={removeFromCart} 
                handleNext={props.handleNext}
                handleOrder={props.handleOrder}
              />
            </Box>
          </Box>
        </Container>
        </div>
      
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
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
      padding: theme.spacing(2.5),
      //borderRadius: 5,
      //backgroundColor: '#6699CC',
      backgroundColor: '#536999',
      color: 'white',
      justifyContent: 'center',
    },
    merchantWrapper: {
      padding: theme.spacing(2),
      margin: 'auto',
    }
}));

export default ProductDisplay;