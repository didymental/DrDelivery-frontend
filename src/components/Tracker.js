import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI, merchantAPI, loginAPI} from '../apis/rails-backend';
import axios from 'axios';
import {websocketAPI} from '../apis/rails-backend';
import TrackerCard from './TrackerCard';
import ThankYouOrder from './ThankYouOrder';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Tracker = (props) => {
    const ws = new WebSocket(websocketAPI + '?token=' + localStorage.getItem('token'));
    const entry = props.entry;
    const matches = useMediaQuery('(min-width: 769px)');

    const [state, setState] = useState({
        ws: null,
        disconnected: true,
        orderTracked: new Map(),
        show: new Map(),
    });

    //const [orderTracked, setOrderTracked] = useState(new Map());
    const [merchants, setMerchants] = useState([]);
    const classes = useStyles();
    // const [arrForm, setArrForm] = useState([]);

    useEffect(() => {
        ws.addEventListener('message', incomingMessageListener);
        ws.addEventListener('close', closeSocket);
    
        ws.onopen = () => {
            ws.send(JSON.stringify({
              "command":"subscribe",
              "identifier":"{\"channel\":\"OrderChannel\"}"
            }));
        
            ws.send(JSON.stringify({
              "command":"message",
              "identifier":"{\"channel\":\"OrderChannel\"}", 
              "data":"{\"action\": \"request\"}"
            }));
          setState({...state, ws: ws, disconnected: false});
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

        getMerchants();

    
        return () => {
          ws.close();
        }
      }, []);

    const incomingMessageListener = (message) => {
        let messageData = JSON.parse(message.data);
        if (messageData.type !== "ping") {
            let data = {};      
            if (messageData.message !== undefined) {
                const text = messageData.message;
                data = JSON.parse(text);
            }

            if (data.order !== undefined) { // if update from Order Channel
                if (data.order.status !== "completed") {
                    setState({...state, 
                        orderTracked: state.orderTracked.set(data.order.id, data.order),
                        show: state.show.set(data.order.id, false),
                    });
                } else {
                    setState({...state,
                        orderTracked: state.orderTracked.set(data.order.id, data.order),
                        show: state.show.set(data.order.id, true),
                    })
                }
                
            }
        }
    }
    
    const closeSocket = (event) => {
        setState({...state, disconnected: true});
    }

    const orderTrackedArrForm = Array.from(state.orderTracked, ([order_id, order]) => ({order_id, order}));


    return entry === 'order' || entry === 'menu'
      ? orderTrackedArrForm.filter(obj => obj.order.status !== "completed" 
          || state.show.get(obj.order_id)).length === 0 
          ? (<Box>
                <Box className={classes.outerbox}>
                      <Typography variant="h5">
                      <Box fontWeight="bold" className={classes.box}>You currently have no orders</Box>
                      </Typography>
              </Box>
            </Box>)
          : (
              <Box >
                <Box className={classes.outerbox}>
                  <Typography variant="h5">
                  <Box fontWeight="bold" className={classes.box}>Your Order Progress</Box>
                  </Typography>
                </Box>
                    
                      
                      <Box display={matches ? 'block': 'flex'} overflow="auto" >
                    {
                        orderTrackedArrForm.map(obj => (
                          
                            state.show.get(obj.order_id) 
                            ? (
                             
                              <Box flexGrow={1}>
                                <ThankYouOrder
                                    state={state}
                                    setState={setState}
                                    merchants={merchants}
                                    order={obj.order}
                                />
                                </Box>
                           
                            )
                            : (
                              
                              <Box flexGrow={1}>
                                <TrackerCard 
                                    merchants={merchants}
                                    order={obj.order}
                                    merchantID={obj.order.merchant_id}
                                    status={obj.order.drone_id === null ? 'Drone is being assigned' : obj.order.status}
                                    setState={setState}
                                    state={state}
                                    entry={entry}
                                />
                              </Box>
                              
                            )
                    )
                    )
                    }
                    </Box>
                    
                  </Box>
          )
      : orderTrackedArrForm.filter(obj => obj.order.status !== "completed" 
      || state.show.get(obj.order_id)).length === 0 
      ? null
      : (
        <Box>
          <Box className={classes.outerbox}>
              <Typography variant="h5">
              <Box fontWeight="bold" className={classes.box}>Your Order Progress</Box>
              </Typography>
            </Box>
                {
                    orderTrackedArrForm.map(obj => (
            
                
                        state.show.get(obj.order_id) 
                        ? (
                            <ThankYouOrder
                                state={state}
                                setState={setState}
                                merchants={merchants}
                                order={obj.order}
                            />
                        )
                        : (
                        <TrackerCard 
                            merchants={merchants}
                            order={obj.order}
                            merchantID={obj.order.merchant_id}
                            status={obj.order.drone_id === null ? 'Drone is being assigned' : obj.order.status}
                            setState={setState}
                            state={state}
                            entry={entry}
                        />)
                )
                )
                }
              </Box>
      )
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
};

function convertStatusToString(status) {
    switch(status) {
        case 'merchant_preparing': 
            return 'Merchant Preparing';

        case 'awaiting_drone_pickup':
            return 'Drone is Picking Up Your Order';

        case 'enroute_to_customer':
            return 'Drone is on the way';
            
        case 'awaiting_customer_pickup':
            return 'Your Delivery is here';

        case 'completed':
            return 'Completed';

        default: 
            return '';
    }
}

const useStyles = makeStyles((theme) => ({
    outerbox: {
      //padding: theme.spacing(2),
      maxWidth: '650px',
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      display: 'flex',
    },
    box: {
      //padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      alignSelf: 'flex-start',
    },
  }));

export default Tracker;