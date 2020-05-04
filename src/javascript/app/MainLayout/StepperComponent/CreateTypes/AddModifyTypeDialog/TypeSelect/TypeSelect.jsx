import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import {ListItemText, MenuItem, TextField} from '@material-ui/core';
import {Paper} from '@jahia/ds-mui-theme';
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

inputComponent.propTypes = {
    inputRef: PropTypes.func
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

Control.propTypes = {
    selectProps: PropTypes.object,
    innerProps: PropTypes.object,
    innerRef: PropTypes.func,
    children: PropTypes.array
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

Option.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    innerProps: PropTypes.object,
    label: PropTypes.string,
    value: PropTypes.string,
    selectProps: PropTypes.object
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

Menu.propTypes = {
    selectProps: PropTypes.object,
    innerProps: PropTypes.object,
    children: PropTypes.object
};

const SingleValue = props => (
    <ListItemText primary={props.data.label} secondary={props.data.value}/>
);

SingleValue.propTypes = {
    data: PropTypes.object
};

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

const TypeSelect = ({classes, t, value, handleClose, handleChange, handleOpen, defaultNodes, allNodes, isLoading}) => {
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
                    threshold: 0.35,
                    location: 0,
                    distance: 32,
                    maxPatternLength: 16,
                    minMatchCharLength: 1,
                    keys: ['displayName']
                });
            const fuzzySortedNodeTypeNames = fuse.search(keyword);
            updateOptionItems(convertTypesToSelectOptions(fuzzySortedNodeTypeNames.slice(0, 49), false));
        }
    };

    return (
        <Select isLoading={isLoading}
                classes={classes}
                defaultValue={defaultItem}
                options={optionItems}
                components={components}
                filterOption={option => ({option})} // Bypass default filter for select option item
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
    value: PropTypes.object,
    handleClose: PropTypes.func,
    handleChange: PropTypes.func.isRequired,
    handleOpen: PropTypes.func,
    defaultNodes: PropTypes.array.isRequired,
    allNodes: PropTypes.array.isRequired,
    isLoading: PropTypes.bool
};

export default withStyles(styles, {withTheme: true})(withApollo(TypeSelect));
