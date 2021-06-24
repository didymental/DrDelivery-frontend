import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {merchantAPI, loginAPI} from '../apis/rails-backend';
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
import { GridListTileBar } from '@material-ui/core';

const HorizontalLabelPositionBelowStepper = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [merchants, setMerchants] = useState([]);
  const [merchantId, setMerchantId] = useState(null);

  const handleNext = (id) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setMerchantId(id);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

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
      <Grid container spacing={2}>
          {merchants.map(elem => (
            <Grid
            item xs={4}>
                <MerchantCard data={elem} action={props.action}/>
            </Grid>))}
      </Grid>
      // <div className={classes.root}>
      //   <GridList cellHeight={180} className={classes.gridList}>
      //     {merchants.map(elem => (
      //       <GridListTile key={elem.name}>
      //         <GridListTileBar>
      //           <MerchantCard data={elem} action={props.action}/>
      //         </GridListTileBar>
      //       </GridListTile>
      //     ))}
      //   </GridList>
      // </div>
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
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : activeStep === 0
            ? (
              <MerchantDisplay action={handleNext}/>
              )
            : (
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div>
                  <ProductDisplay id={merchantId}/>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    Back
                </Button>
                  <Button variant="contained" color="primary" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
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
  return ['Browse Our Merchants', 'Choose an Item', 'Add to Cart', 'Check Out'];
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