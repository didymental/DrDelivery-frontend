import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useState, useEffect} from 'react';
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
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

const AppHeader = (props) => {
    const [state, setState] = useState({
        open: false,
    });
    const [media, setMedia] = useState(true);

    const toggleDrawer = (open) => {
        if (open) {
            setState({...state, open: open});
        } else {
            setState({...state, open: false});
        }
    }

    const classes = useStyles();

    const mediaQuery = window.matchMedia('(min-width: 768px');
    console.log(mediaQuery);

    useEffect(() => {
      setMedia(mediaQuery.matches);
    }, [setMedia, mediaQuery]);

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
                  <ListItem button key={1}>
                    <AccountCircleIcon/>
                    <ListItemText
                        primary={'Profile'}/>
                  </ListItem>
                </Link>
                <ListItem button key={2} onClick={handleLogout}>
                  
                    <ListItemText
                        primary={'Logout'}/>
                </ListItem>
                
            </List>
        );
    }
  
    return media 
      ? (
      <div className={classes.root}>
        <AppBar position="static" elevation={0} className={classes.paper}>
          <Toolbar variant="dense">
            
              <Link to="/home" className={classes.logoPosition} onClick={() => props.setOrder({hasOrder: false})}>
                <Logo width="200" />
              </Link>
            
            <Button className={classes.button}>Map</Button>
            <Link to='/profile' className={classes.button}>
              <Button className={classes.button}>Profile</Button>
            </Link>
            <Button className={classes.button} onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
          
        </AppBar>
        {drawer()}
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
    background: '#536999',
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
    background: 'linear-gradient(315deg, #537895 0%, #09203f 74%)',
  },
  button: {
    display: 'flex',
    alignSelf: 'flex-end',
    color:'white',
  },
  empty: {
    flexGrow: 0,
  }
}));



export default AppHeader;
