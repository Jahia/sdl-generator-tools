import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import {MenuItem, ListItemText, TextField, Paper} from '@material-ui/core';
import * as _ from 'lodash';
import withApollo from 'react-apollo/withApollo';
import {convertTypesToSelectOptions} from '../../CreateTypes.utils';
import TypographyWithHighlight from './TypographyWithHighlight';
import Fuse from 'fuse.js';

const styles = () => ({
    root: {
        flexGrow: 1
    },
    input: {
        display: 'flex',
        padding: 0
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'auto'
    },
    noOptionsMessage: {
        color: '#606060',
        fontWeight: 700
    },
    singleValue: {
        fontSize: 16
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16
    },
    paper: {
        position: 'absolute',
        zIndex: 99,
        marginTop: 0,
        left: 0,
        right: 0
    }
});

const inputComponent = ({inputRef, ...props}) => {
    return <div ref={inputRef} {...props}/>;
};

const Control = props => {
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
};

const Option = props => {
    return (
        <MenuItem selected={props.isSelected}
                  component="div"
                  style={{
                    padding: '15px 12px'
                  }}
                  {...props.innerProps}
        >
            <ListItemText primary={<TypographyWithHighlight content={props.label} part={props.selectProps.inputValue}/>}
                          secondary={props.value}/>
        </MenuItem>
    );
};

const Menu = props => {
    return (
        <Paper
            square
            className={props.selectProps.classes.paper}
            {...props.innerProps}
        >
            {props.children}
        </Paper>
    );
};

const SingleValue = props => (
    <ListItemText primary={props.data.label} secondary={props.data.value}/>
);

const components = {
    Control,
    Menu,
    Option,
    SingleValue
};

const fetchDefaultOptionItem = (optionItems, updateOptionItems, defaultValue) => {
    let defaultItem = !_.isNil(optionItems) ? optionItems.find(e => e.value === defaultValue.value) : null;

    if (!_.isNil(defaultItem)) {
        return defaultItem;
    }

    updateOptionItems([
        ...optionItems,
        {
            label: defaultValue.label,
            value: defaultValue.value
        }
    ]);
    return optionItems[optionItems.length - 1];
};

const TypeSelect = ({classes, t, disabled, value, handleClose, handleChange, handleOpen, defaultNodes, allNodes, isLoading}) => {
    const [optionItems, updateOptionItems] = useState(convertTypesToSelectOptions(defaultNodes, true));
    const defaultItem = !_.isNil(value) ? fetchDefaultOptionItem(optionItems, updateOptionItems, value) : null;

    const handleSearch = keyword => {
        if (_.isNil(keyword) || keyword.replace(/^\s+|\s+$/gm, '') === '') {
            // Reset the select options to default list
            updateOptionItems(convertTypesToSelectOptions(defaultNodes, true));
            return;
        }

        if (!_.isNil(allNodes)) {
            const fuse = new Fuse(allNodes,
                {
                    shouldSort: true,
                    threshold: 0.6,
                    location: 0,
                    distance: 8,
                    maxPatternLength: 32,
                    minMatchCharLength: 1,
                    keys: ['displayName']
                });
            const fuzzySortedNodeTypeNames = fuse.search(keyword);
            updateOptionItems(convertTypesToSelectOptions(fuzzySortedNodeTypeNames.slice(0, 49), false));
        }
    };

    return (
        <Select isDisabled={disabled}
                isLoading={isLoading}
                classes={classes}
                defaultValue={defaultItem}
                options={optionItems}
                components={components}
                filterOption={(option, rawInput) => ({option})} // Bypass default filter for select option item
                isClearable={false}
                placeholder={t('label.sdlGeneratorTools.createTypes.selectSearchNodeType')}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
                onInputChange={keyword => handleSearch(keyword)}
        />
    );
};

TypeSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
};

export default withStyles(styles, {withTheme: true})(withApollo(TypeSelect));
