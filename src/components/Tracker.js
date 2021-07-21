import React from 'react';
import {useState, useEffect} from 'react';
import {customerAPI, merchantAPI, loginAPI} from '../apis/rails-backend';
import axios from 'axios';
import {websocketAPI} from '../apis/rails-backend';
import TrackerCard from './TrackerCard';
import ThankYouOrder from './ThankYouOrder';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';



const Tracker = (props) => {
    const ws = new WebSocket(websocketAPI + '?token=' + localStorage.getItem('token'));

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


    return orderTrackedArrForm.filter(obj => obj.order.status !== "completed" 
        || state.show.get(obj.order_id)).length === 0 
        ? null
        : (
            <Box className={classes.outerbox}>
                <Typography variant="h5">
                <Box fontWeight="bold" className={classes.box}>Your Order Progress</Box>
                </Typography>
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
                            status={obj.order.status}
                            setState={setState}
                            state={state}
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

export default Tracker;