import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CircularProgress from '@material-ui/core/CircularProgress';

export const MerchantCard = (props) => {
  const classes = useStyles();
  const name = props.data.name;
  const location = props.data.addresses[0].street_address;
  const merchantId = props.data.id;
  const merchantAddressID = props.data.addresses[0].id;
  const merchantName = props.data.name;

  // props.setLoad(false);

  return (
    <div className={classes.wrapper}>
    <Card className={classes.root} onClick={() => props.action(merchantId, merchantAddressID, merchantName)}>
      <CardMedia 
        image='https://source.unsplash.com/random'
        style={{height: 140}}/>
        
      <CardHeader
        avatar={
          <Avatar aria-label="merchant" className={classes.avatar}>
                {name[0]}
            </Avatar>
        }
        action={
          <IconButton aria-label="product" 
          >
            <ArrowForwardIosIcon />
          </IconButton>
        }
        title={
            name
              ? 
                <Box display={{sm: 'block', md: 'flex'}}>
                  {name}
                </Box>
              : 
                <CircularProgress size='1rem'/>
        }
        subheader={location ? location : <CircularProgress size='1rem'/>}
      />
    </Card>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  wrapper: {
    marginTop: theme.spacing(2),
    // padding: theme.spacing(2),
  }
}));

export default MerchantCard;