import React from 'react';
import {makeStyles } from '@material-ui/core/styles';

const Logo = (props) => {
    const classes = useStyles();
    let url = '';
    if (props.color === 'black') {
        url = 'https://res.cloudinary.com/didymusne/image/upload/v1623594167/LogoBlack_hrnbko.png';
    } else if (props.color === 'white') {
        url = 'https://res.cloudinary.com/didymusne/image/upload/v1623594098/LogoWhite_tvfwfm.png';
    } else {
        url = 'https://res.cloudinary.com/didymusne/image/upload/v1623594012/DrDeliveryLogo_svcub2.png';
    }

    let width = "250";
    if (props.width) {
        width = props.width;
    }
    
    return (
        <div className={classes.root}>
            <img 
                src={url}
                alt='logo'
                width={width}
                 />
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    actionCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export default Logo;