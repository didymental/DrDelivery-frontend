import React from 'react';
import {useState, useEffect} from 'react';

import {makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

const PastProductTable = (props) => {
    const merchantProducts = props.merchantProducts;
    const orderEntries = props.orderEntries;

    const classes = useStyles();

    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table aria-label="simple table" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Product</TableCell>
                        <TableCell align="left">Quantity</TableCell>
                        <TableCell align="left">Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orderEntries.map(x => {
                        return (
                            <ProductTable order={x} prodID={x.product_id} merchantProducts={merchantProducts}/>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
};

const ProductTable = (props) => {
    const prodID = props.prodID;
    const merchantProducts = props.merchantProducts;
    const [productName, setProductName] = useState('');
    let loading = productName.length === 0;

    function searchProductName(id, arr) {
        if (arr.length === 0) {
            return null;
        } else {
            let len = arr.length;
            let start = 0;
            let end = len - 1;
            
            while (start < end) {
                let mid = start + Math.floor((end - start)/2);
                if (id <= arr[mid].id) {
                    end = mid;
                } else {
                    start = mid + 1;
                }
            }

            if (arr[start].id === id) {
                setProductName(arr[start].name);
            }

            
        }
    }

    useEffect(() => {
        searchProductName(prodID, merchantProducts);
    }, [prodID, merchantProducts])

    return (
        <TableRow>
            <TableCell align="left">{loading ? <CircularProgress size={10} /> : productName}</TableCell>
            <TableCell align="right">{props.order.units_bought}</TableCell>
            <TableCell align="right">{props.order.total_unit_price.toFixed(2)}</TableCell>
        </TableRow>
    )

}

const useStyles = makeStyles((theme) => ({
    table: {
        //padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

export default PastProductTable;