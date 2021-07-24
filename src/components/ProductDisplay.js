import React from 'react';
import {useState, useEffect, useRef} from 'react';
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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fab from '@material-ui/core/Fab';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';

const ProductDisplay = (props) => {
    const matches = useMediaQuery('(min-width: 768px)');
    const matched = useMediaQuery('(min-width: 769px)');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orderId, setOrderId] = useState(0);

    const addToCart = (item, orderId) => {
        const toAdd = {...item, orderId: orderId};
        setCart([...cart, toAdd]);
        setOrderId(orderId);
    }

    const removeFromCart = (item) => {
        // let cartCopy = cart.filter((order) => order.id !== item.id);
        // let toDelete = cart.filter((order) => order.id === item.id);
        // for (let i = 0; i < toDelete.length - 1; i++) {
        //   cartCopy = [...cartCopy, toDelete[i]];
        // }

        let cartCopy = [];

        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id !== item.id) {
            cartCopy = [...cartCopy, cart[i]];
          } 
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

    const bottomRef = useRef();


    return loading ? <LinearProgress/> : (
      <div className={classes.root}>
        {matched ? null : (
          
            
              <AppBar position="fixed"
              style={ {
                background: 'transparent', 
                boxShadow: 'none',
              }}
              className={classes.fabWrapper}


              
              >
            <Fab 
              size="small" 
              color="secondary" 
              aria-label="go to cart"
              onClick={() => {
                bottomRef.current.scrollIntoView({behavior: 'smooth'});
              }}
              className={classes.fab}
            > 
            
              <ShoppingCartBadge count={cart.length}/>
            </Fab>
            </AppBar>
            
            
          )}
        
        <Box display={{sm: 'block', md: 'flex'}}>
          <Container>
            <Container className={classes.merchantWrapper}>
              <Typography variant="h4">
                {props.merchantName}
              </Typography>
              <br/>
              <Divider/>
            </Container>
            <Box className={classes.productsWrapper} flexGrow={2}>
              <Grid 
                container 
                spacing={1}
                direction="row"
                alignItems="flex-start"
              >
                
                  {products.map(elem => (
                    
                    <Grid
                    item xs={matches ? 4 : 6}
                    className={classes.container}
                    key={elem.id}>
                        <Product 
                          details={elem} 
                          addToCart={addToCart} 
                          removeFromCart={removeFromCart} 
                          orderId={orderId}
                          image={'https://source.unsplash.com/random'}/>
                      </Grid>
                      
                      ))
                    }
                
                </Grid>
                
              </Box>
          </Container>
          <Box className={classes.cartWrapper} flexGrow={1} ref={bottomRef}>
            <Cart 
              cart={cart} 
              addToCart={addToCart} 
              removeFromCart={removeFromCart} 
              handleNext={props.handleNext}
              handleOrder={props.handleOrder}
            />
          </Box>
        </Box>
        
        </div>
      
    )
}

const ShoppingCartBadge = (props) => {
  const classes = useStyles();
  return (
          <Badge badgeContent={props.count} >
              <ShoppingCartIcon />
          </Badge>
    
  );
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
      backgroundColor: '#2B468B',
      color: 'white',
      justifyContent: 'center',
    },
    merchantWrapper: {
      padding: theme.spacing(2),
      margin: 'auto',
    },
    fab: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      display: 'flex',
      alignSelf: 'flex-end',
      background: '#FF4774'
    },
    fabWrapper: {
      marginTop: '100%',
    }
    
}));

export default ProductDisplay;