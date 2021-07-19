import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from './Logo';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HistoryIcon from '@material-ui/icons/History';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const ProfileMenu = (props) => {
  
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const classes = useStyles();

  const handleMyOrder = () => {
    return props.history.push("/orderHistory");
  }

  const handleAccount = () => {
    return props.history.push("/profile");
  }

  const handleOrderProgress = () => {
    return props.history.push("/orderProgress");
  }

  return (
    <div className={classes.button}>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.button}>
        Profile
      </Button>
      <Menu 
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MenuList>
            <MenuItem onClick={handleAccount}>
            <ListItemIcon>
              <AccountCircleIcon/>
            </ListItemIcon>
              Account
            </MenuItem>
            <MenuItem onClick={handleMyOrder}>
              <ListItemIcon>
                <HistoryIcon/>
              </ListItemIcon>
              My Orders
            </MenuItem>
            <MenuItem onClick={handleOrderProgress}>
              <ListItemIcon>
                <DonutLargeIcon/>
              </ListItemIcon>
              Order Progress
            </MenuItem>
          </MenuList>
      </Menu>
    </div>
  );
}

const AppHeader = (props) => {
    const [state, setState] = useState({
        open: false,
    });
    const matches = useMediaQuery('(min-width: 769px)');

    const toggleDrawer = (open) => {
        if (open) {
            setState({...state, open: open});
        } else {
            setState({...state, open: false});
        }
    }

    const classes = useStyles();


    const history = useHistory();

    const handleLogout = () => {
        props.setState({
            isLoggedIn: false,
            user: '',
        });
        props.setOrder({...props.order, hasOrder: false});

        localStorage.removeItem('userID');
        localStorage.removeItem('token');
        history.push("/");
    }

    const handleMyOrder = () => {
      return history.push("/orderHistory");
    }
  
    const handleAccount = () => {
      return history.push("/profile");
    }

    const handleOrderProgress = () => {
      return history.push("/orderProgress");
    }


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
          <MenuList>
                <ListSubheader className={classes.title}>
                  DrDelivery Menu
                </ListSubheader>

                <MenuItem onClick={handleAccount}>
                  <ListItemIcon>
                    <AccountCircleIcon className={classes.drawerIcons} />
                  </ListItemIcon>
                  Account
                </MenuItem>

                <MenuItem onClick={handleMyOrder}>
                  <ListItemIcon>
                    <HistoryIcon className={classes.drawerIcons} />
                  </ListItemIcon>
                  My Order
                </MenuItem>

                <MenuItem onClick={handleOrderProgress}>
                  <ListItemIcon>
                    <DonutLargeIcon className={classes.drawerIcons} />
                  </ListItemIcon>
                  Order Progress
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon className={classes.drawerIcons} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
                
            </MenuList>
        );
    }
  
    return matches 
      ? (
      <div className={classes.root}>
        <AppBar position="static" elevation={0} className={classes.paper}>
          <Toolbar variant="dense">
            
              <Link to="/home" className={classes.logoPosition} onClick={() => props.setOrder({hasOrder: false})}>
                <Logo width="200" />
              </Link>
            {/* <Link to='/orderProgress' className={classes.button}>
              <Button className={classes.button}>Order Progress </Button>
            </Link> */}
            <ProfileMenu history={history}/>
            <Button className={classes.button} onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
          
        </AppBar>
        
      </div>
    )
    : (
      <div className={classes.root}>
        <AppBar position="static" elevation={0} className={classes.paper}>
          <Toolbar variant="regular">
            <IconButton 
                edge="start" 
                className={classes.menuButton} 
                aria-label="menu" 
                onClick={ () => toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Container className={classes.logoPosition} onClick={() => props.setOrder({hasOrder: false})}>
              <Link to="/home">
                <Logo width="200" />
              </Link>
              
            </Container>
          </Toolbar>
          
        </AppBar>
        {drawer()}
      </div>
    );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
    //background: 'linear-gradient(315deg, #537895 0%, #09203f 74%)',
    // background: '#536999',
    background: '#2B468B',
    display: 'flex',
  },
  logoPosition: {
    // margin: 'auto',
    // alignSelf: 'flex-start',
    flexGrow: 1,
    display: 'flex',
    alignSelf: 'flex-start',
  },
  drawer: {
    border: 0,
    boxShadow: '0 3px 5px 2px rgba(205, 205, 235, 0.5)',
    color: 'white',
    borderRadius: 5,
    // background: 'linear-gradient(315deg, #537895 0%, #09203f 74%)',
    background: '#2B468B',
  },
  button: {
    display: 'flex',
    alignSelf: 'flex-end',
    color:'white',
  },
  empty: {
    flexGrow: 0,
  },
  drawerIcons: {
    color: 'white',
  }
}));

export default AppHeader;