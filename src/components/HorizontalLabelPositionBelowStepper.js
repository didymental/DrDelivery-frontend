import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {merchantAPI, loginAPI, newOrderAPI} from '../apis/rails-backend';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MerchantCard from './MerchantCard';
import ProductDisplay from './ProductDisplay';
import Container from '@material-ui/core/Container';
import { GridListTileBar } from '@material-ui/core';

const HorizontalLabelPositionBelowStepper = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [merchants, setMerchants] = useState([]);
  const [merchantId, setMerchantId] = useState(null);
  const [order, setOrder] = useState([]);

  const handleNext = (id) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === 0) {
      setMerchantId(id);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleOrder = async (orders) => {
    console.log(orders);
    setOrder(orders);
    const token = localStorage.getItem('token');
    const response = await axios.post(newOrderAPI, orders,{
      headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
      }
    });
    console.log(response);
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

  useEffect(() => {
    getMerchants();
  }, []);

  // setMerchants(merchantList);
  
  

  const MerchantDisplay = (props) => {
    return (
      <Container>
      <Grid container spacing={2} md={12}>
      
          {merchants.map(elem => (
            <Grid
            item xs={4}>
                <MerchantCard data={elem} action={props.action}/>
            </Grid>))}
            </Grid>
      </Container>
    );
  }

  return (
    <div className={classes.root}>
      <Box borderBottom={0.2}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
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
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div>
                  <ProductDisplay id={merchantId} handleNext={handleNext} handleOrder={handleOrder}/>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    Back
                </Button>
                  
                </div>
              </div>
              )
              : 
              ( 
              <div>
                <Button variant="contained" color="primary" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
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
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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