import React from 'react';
import {useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListIcon from '@material-ui/icons/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const AppHeader = () => {
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

    const drawer = () => {
        return (
            <Drawer
                classes={{paper: classes.paper}}
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
            <List>
                <ListSubheader className={classes.title} color="inherit ">Menu</ListSubheader>
                <ListItem button key={1} onClick={() => toggleDrawer()}>
                    <ListItemText
                        primary={'LOGOUT'}/>
                </ListItem>
            </List>
        );
    }
  
    return (
      <div className={classes.root}>
        <AppBar position="static" elevation='0' style={{backgroundColor: "#FF7474"}}>
          <Toolbar>
            <IconButton 
                edge="start" 
                className={classes.menuButton} 
                color="inherit" 
                aria-label="menu" 
                onClick={ () => toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
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
  },
  title: {
    flexGrow: 1,
  },
  paper: {
      background: "#FF7474",
  }
}));



export default AppHeader;
