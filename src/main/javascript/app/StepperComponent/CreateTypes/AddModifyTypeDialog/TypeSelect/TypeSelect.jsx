import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import {MenuItem, ListItemText, TextField, Paper, Typography} from '@material-ui/core';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import * as _ from "lodash";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'auto',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        marginTop: 0,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    }
});

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps
                }
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

const Option = props => {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
                padding: '15px 12px'
            }}
            {...props.innerProps}
        >
            <ListItemText primary={props.label} secondary={props.value}/>
        </MenuItem>
    );
}

function Menu(props) {
    return (
        <Paper
            square
            className={props.selectProps.classes.paper}
            {...props.innerProps}
        >
            {props.children}
        </Paper>
    );
}

const SingleValue = props => (
    <ListItemText primary={props.data.label} secondary={props.data.value}/>
);

const components = {
    Control,
    Menu,
    Option,
    SingleValue
};

const TypeSelect = ({classes, theme, t, disabled, value, open, handleClose, handleChange, handleOpen, jcrNodeTypes}) => {

    const optionItems = !_.isNil(jcrNodeTypes) ? jcrNodeTypes.map(type => (
        {
            label: type.displayName,
            value: type.name
        }
    )) : null;

    const defaultItem = !_.isNil(optionItems) ? optionItems.find(e => e.value === value) : null;

    return (
        <Select isDisabled={disabled}
                classes={classes}
                defaultValue={defaultItem}
                options={optionItems}
                components={components}
                isClearable={false}
                placeholder={t('label.sdlGeneratorTools.createTypes.selectSearchNodeType')}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
        />
    );
}

TypeSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(TypeSelect);
