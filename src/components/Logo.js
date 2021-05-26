import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const Logo = () => {
    const classes = useStyles();
    return (
        <Box>
            <div className={classes.alignItemsAndJustifyContent}>
                DrDelivery 
            </div>
        </Box>
    );
}

// styling
const useStyles = makeStyles({
    alignItemsAndJustifyContent: {
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 50,
        color: "#FF7474"
    },
})

export default Logo;