import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const YourAddressHeader = () => {
    const classes = useStyles();
    return (
        <div className={classes.header}>
            <Box className={classes.boxSize}>
                <h1>Deliver to</h1>
            </Box>
        </div>
    );
}

const useStyles = makeStyles({
    header: {
        marginLeft: "3%",
        boxShadow: "0px 15px 10px -15px",
    },
    boxSize: {
        minHeight: "50px",
        
    }
});

export default YourAddressHeader;