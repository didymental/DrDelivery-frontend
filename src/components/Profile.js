import React from 'react';
import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from "@material-ui/core/InputAdornment";

const EditableTextField = (props) => {
    const [state, setState] = useState({
        email: '',
        addresses: [],
        contactNum: parseInt(''),
        editMode: false,
    })
    
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <TextField
                name="email"
                name="email"
                defaultValue={'value'}
                margin="normal"
                error={state.email === ""}
                onChange={() => console.log('hnadleChange')}
                disabled={!state.editMode}
                className={classes.textField}
                onMouseOver={()=> {console.log('handle mouse over')}}
                onMouseOut={() => {console.log('handle mouse out')}}
                InputProps={{
                    classes: {
                        disabled: classes.disabled
                    },
                    endAdornment:
                        state ?
                    <InputAdornment position="end">
                        <IconButton onClick={()=>{console.log('handle click')}}><EditIcon /></IconButton>
                        </InputAdornment>
                        :
                        ""
                }}
            
            />

        </div>
    )




}

const Profile = () => {
    return (<div>
        <EditableTextField/>
    </div>);
}

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: 50,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
        color: 'black',
        fontSize: 30,
        opacity: 1,
        borderBottom: 0,
    },
    disabled: {
        color: 'black',
        borderBottom: 0,
        btnIcons: {
            marginLeft: 10,
        }
    }
  }));

export default Profile;