import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {customerAPI, merchantAPI, loginAPI, newOrderAPI, websocketAPI} from '../apis/rails-backend';
import OrderStatus from './OrderStatus';
import MapContainer from './Map';

import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MerchantCard from './MerchantCard';
import ProductDisplay from './ProductDisplay';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const HorizontalLabelPositionBelowStepper = (props) => {
  const matches = useMediaQuery('(min-width: 769px)');
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [merchants, setMerchants] = useState([]);
  const [merchantId, setMerchantId] = useState(null);
  const [merchantName, setMerchantName] = useState(null);
  const [pickUpAdd, setPickUpAdd] = useState(null);
  const [orderStatus, setOrderStatus] = useState();

  const handleNext = (id, addressID, name) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === 0) {
      setMerchantId(id);
      setPickUpAdd(addressID);
      setMerchantName(name);
    }
    
    if (activeStep === 2) {
      handleEndOrder({hasOrder: false});
    }
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleOrder = async (orders) => {
    setLoading(true);
    let toPost = {
      customer_id: localStorage.getItem('userID'),
      merchant_id: '' + merchantId,
      total_price: orders[1],
      pick_up_address_id: pickUpAdd,
      drop_off_address_id: '' + props.dropOffAdd,
    }

    toPost = {...toPost, order_entries: orders[0]}

    const token = localStorage.getItem('token');
    const response = await axios.post(newOrderAPI, toPost, {
      headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
      }
    });
    setOrderStatus(response.status);
    handleNext();
  }

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
  }

  const handleEndOrder = () => {
    handleNext();
  }

  const getMerchants = async () => {
    const token = await getAdminToken();
    axios.get(merchantAPI, {
      headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
      }
    }).then(response => {
      let merchantList = [...response.data];
      setMerchants(merchantList);
    });
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchants().then(response => setLoading(false));
  }, [setLoading]);  

  const MerchantDisplay = (props) => {
    return loading ? <LinearProgress/>: (
      <Container>
        <Grid container spacing={2} alignItems="center">
                { merchants.map(elem => (
                  <Grid 
                    item 
                    xs={matches ? 4 : 12}
                  >
                    <Box className={classes.boxWrapper}>
                        <MerchantCard 
                          data={elem} 
                          action={props.action}
                          style={{display: 'flex', alignSelf: 'center'}}
                          />
                    </Box>
                    </Grid>
                  
                  ))
                } 
          </Grid>
      </Container>
    );
  }

  

  return (
    <div className={classes.root}>
      <Box borderBottom={0.2}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Tooltip title={label === 'Browse Our Merchants' ? "Return to Merchant Page" : ""}>
              <Step key={label} >
                <StepLabel>{label}</StepLabel>
              </Step>
            </Tooltip>
          ))}
        </Stepper>
      </Box>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>Move over to Checkout screen</Typography>
            <Button onClick={handleReset}>Browse other merchants</Button>
          </div>
        ) : activeStep === 0
            ? (
              <MerchantDisplay action={handleNext}/>
              )
            : activeStep === 1
              ? (
              //<div className={classes.root}>
              <div>
                {/* <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography> */}
                <ProductDisplay 
                  id={merchantId} 
                  handleNext={handleNext} 
                  handleOrder={handleOrder}
                  className={classes.products}
                  merchantName={merchantName}
                />  
              </div>
              )
              : 
              ( 
              <div>
                <MapContainer 
                  ws={new WebSocket(websocketAPI + '?token=' + localStorage.getItem('token'))}
                  drones={new Map()}
                  route={new Map()}
                  merchantAddresses={new Map()}
                  customerAddresses={new Map()}
                  chargingRoutes={new Map()}
                  entry={'order'}
                  
                />
                <OrderStatus orderStatus={orderStatus} />
                </div>
            )}
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  tile: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    
  },
  gridList: {
    width: 500,
    height: 450,
  },
  root: {
    width: '100%',
    backgroundColor: 'rgba(52, 52, 52, 0.0)',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  products: {
    width: '100%',
  },
  stepIcon: {
    color: '#536999',
  },
  boxWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const getSteps = () => {
  return ['Browse Our Merchants', 'Select Items','Check Out'];
};

const getStepContent = (stepIndex) => {
  switch (stepIndex) {
    case 0: {
      return '';
    }
    case 1:
      return '';
    case 2:
      return '';
    default:
      return '';
  }
};

export default HorizontalLabelPositionBelowStepper;