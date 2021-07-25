import React from 'react';
import {useState, useEffect} from 'react';
import {Box, Typography, TextField} from '@material-ui/core';
import InputAdornment from "@material-ui/core/InputAdornment";

import {makeStyles} from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

const EditableTextField = (props) => {
    const [state, setState] = useState({
        editMode: false,
    })
    const [text, setText] = useState(props.value);

    const [editCount, setEditCount] = useState(0);

    const error = props.error;
    const helperText = props.helperText;

    const classes = useStyles();

    useEffect(() => {
        

    }, [state.editMode])

    const handleChange = (input) => {
        setEditCount(editCount+1);
        setText(input.target.value);
        props.handleChange(input.target.value);
    }
 
    return props.name === 'Email' 
        ? (
            <Box className={classes.container}>
                <div>
                <Typography variant="h6">
                    {props.name}
                </Typography>
                <div>
                </div>
                <TextField
                    id={props.name}
                    value={props.value}
                    margin="normal"
                    disabled={true}
                    error={error}
                    helperText={helperText}
                />
                
                </div>
    
            </Box>
        )
        : (
        <Box className={classes.container}>
            <div>
            <Typography variant="h6">
                {props.name}
            </Typography>
            <div>
            </div>
            <TextField
                id={props.name}
                value={editCount === 0 ? props.value : text}
                margin="normal"
                onChange={handleChange}
                disabled={!state.editMode}
                error={error}
                helperText={helperText}
                
                InputProps={{
                    endAdornment:
                    <InputAdornment position="end">
                        {!state.editMode 
                            ? (
                                <IconButton onClick={() => setState({...state, editMode: true})}>
                                    <EditIcon />
                                </IconButton>
                            )
                            : null
                        }
                        </InputAdornment>
                }}
            />
            </div>
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
    },
}));

export default EditableTextField;