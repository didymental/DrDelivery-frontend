import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {connect} from 'react-redux';
import {signIn, signOut} from '../actions';

class EmailAuth extends React.Component {

}

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn };
};


export default connect(mapStateToProps, {signIn, signOut})(EmailAuth);