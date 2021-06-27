import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
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

  // props.setLoad(false);

  return (
    
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="merchant" className={classes.avatar}>
            {name[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="product" 
            onClick={() => props.action(merchantId, merchantAddressID)}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        }
        title={name ? name : <CircularProgress size='1rem'/>}
        subheader={location ? location : <CircularProgress size='1rem'/>}
      />
    </Card>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
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
}));

export default MerchantCard;