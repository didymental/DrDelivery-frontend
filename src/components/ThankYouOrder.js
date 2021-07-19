import React from 'react';
import {Grid, Box, Typography, Paper, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const ThankYouOrder = (props) => {
    const searchMerchantName = props.searchMerchantName;
    const matches = props.matches;
    const order = props.order;
    const handleClear = props.handleClear;
    const merchants = props.merchants;

    const classes = useStyles();

    return (
        <Paper className={classes.outerbox}>
          <Box className={classes.innerBox}>
          <Grid 
            container 
            direction="row">
              <Grid 
                item
                xs>
                <Typography variant="body1">
                  <Box fontWeight="fontWeightBold" className={classes.detailsBox}>
                  Enjoy your order 🛍️
                  Thank you for shopping with us! 
                  </Box>
                </Typography>
              </Grid>
              <Grid 
                container
                direction={matches ? "row" : "column"}
              >
                <Grid 
                  item
                  xs
                >
                  <Typography variant="body2" color="textSecondary">
                    {searchMerchantName(order.merchant_id, merchants)}
                  </Typography>
                </Grid>

                <Grid 
                  item
                >
                  <Typography variant="body2" color="textSecondary">
                    <Box>
                    {'Total Price: S$' + order.total_price.toFixed(2)}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
          </Grid>
          <Box className={classes.clearButton}>
            <Button size="small" className={classes.buttonClear} onClick={handleClear}>
              Clear
            </Button>
          </Box>
          </Box>
        </Paper>
      );
}

const useStyles = makeStyles((theme) => ({
    outerbox: {
      padding: theme.spacing(3),
      maxWidth: '650px',
      marginBottom: theme.spacing(2),
      //display: 'flex',
    },
    innerBox: {
      display: 'flex',
    },
    box: {
      //padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    buttonWrapper: {
      marginTop: theme.spacing(1.25),
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(1.25),
      background: 'linear-gradient(45deg, #FF9068 30%, #FF4b1F 90%)',
      color: 'white',
    },
    detailsBox: {
      marginBottom: theme.spacing(1),
      display: 'flex',
      //flexDirection: 'column',
    },
    clearButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing(2.5),
      //padding: theme.spacing(0.5),
    },
    buttonClear: {
      background: '#E9E9E9',
    }
  }));

export default ThankYouOrder;