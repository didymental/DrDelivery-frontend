import React from 'react';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from './Logo';

const AppHeader = (props) => {
    const [state, setState] = useState({
        open: false,
    });

    const toggleDrawer = (open) => {
        if (open) {
            setState({...state, open: open});
        } else {
            setState({...state, open: false});
        }
    }

    const classes = useStyles();

    // const menuOptions = () => {
    //   return (
    //     <Menu 
    //       id="fade-menu"
    //       open={state.open}
    //       onClose={toggleDrawer()}
    //       TransitionComponent={Fade}
    //     >
    //       <MenuItem onClick={props.handleLogout}>Logout</MenuItem>
    //     </Menu>
    //   );
    // };



    const drawer = () => {
        return (
            <Drawer
                classes={{paper: classes.drawer}}
                anchor='left'
                open={state.open}
                variant='temporary'
                onClose={() => toggleDrawer(false)}
                >
             {drawerList()}
            </Drawer>
        );
    };
    
    const drawerList = () => {
        return (
            <List >
                <ListSubheader className={classes.title}>
                  Menu
                </ListSubheader>
                <Link to='/profile'>
                <ListItem button key={1} onClick={() => console.log('edit profile')}>
                  <AccountCircleIcon/>
                  <ListItemText
                      primary={'Profile'}/>
                </ListItem>
                </Link>
                <ListItem button key={2} onClick={props.handleLogout}>
                  
                    <ListItemText
                        primary={'Logout'}/>
                </ListItem>
                
            </List>
        );
    }
  
    return (
      <div className={classes.root}>
        <AppBar position="static" elevation={0} className={classes.paper}>
          <Toolbar>
            <IconButton 
                edge="start" 
                className={classes.menuButton} 
                aria-label="menu" 
                onClick={ () => toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <div className={classes.logoPosition}>
              <Link to="/home">
                <Logo width="120" />
              </Link>
            </div>
          </Toolbar>
        </AppBar>
        {drawer()}
      </div>
    );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'white',
  },
  title: {
    flexGrow: 1,
    color: 'orange',
  },
  paper: {
    background: 'linear-gradient(315deg, #537895 0%, #09203f 74%)',
  },
  logoPosition: {
    margin: 'auto',
  },
  drawer: {
    border: 0,
    boxShadow: '0 3px 5px 2px rgba(205, 205, 235, 0.5)',
    color: 'white',
    borderRadius: 5,
    background: 'linear-gradient(315deg, #537895 0%, #09203f 74%)',
  }
}));



export default AppHeader;
