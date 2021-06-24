import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {loginAPI, merchantAPI} from '../apis/rails-backend';
import {makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Product from './Product';

const ProductDisplay = (props) => {
    const [products, setProducts] = useState([]);
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
        <Grid container spacing={2}>
          {products.map(elem => (
            <Grid
            item xs={4}
            className={classes.container}>
                <Product details={elem} />
            </Grid>))}
        </Grid>
    )
}

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',      
      width: 352,
    },
}));

export default ProductDisplay;