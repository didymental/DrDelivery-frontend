import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {connect} from 'react-redux';
import {signIn, signOut} from '../actions';
import {makeStyles } from '@material-ui/core/styles';

class GoogleAuth extends React.Component {

    onSignInClick = () => {
        this.auth.signIn();
    }

    onSignOutClick = () => {
        this.auth.signOut();
    }

    componentDidMount() {
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '1063517645258-mejebac5vh112bdav1qrife2jrfdc1ak.apps.googleusercontent.com',
                scope: 'email',
            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
            } );
        });
    }

    onAuthChange = (isSignedIn) => {
        if (isSignedIn) {
            this.props.signIn(this.auth.currentUser.get().getId());
        } else {
            this.props.signOut();
        }
    }

    renderAuthButton() {
        if (this.props.isSignedIn === null) {
            return null;
        } else if (this.props.isSignedIn) {
            return (
                <Button onClick={this.onSignOutClick}>
                    <Box>
                        <i className="google icon"/>
                        Sign Out
                    </Box>
                </Button>
            );
        } else {
            return (
                <Box borderRadius={5} bgcolor="#FBBC05"> 
                    <Button onClick={this.onSignInClick}>
                    <div>
                        <i className="google icon"/>
                    </div>
                    <div>
                        Login with Google
                    </div>
                    </Button>
                </Box>
            );
        }
    }


    render() {
        return (
            <div>
            {this.renderAuthButton()}
            </div>
        );
    }
}

const actionButton = {
    backgroundColor: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    color: 'white',
}

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, {signIn, signOut})(GoogleAuth);