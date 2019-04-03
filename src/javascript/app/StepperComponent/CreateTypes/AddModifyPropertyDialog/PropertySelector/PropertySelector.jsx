import {FormControl, Input, InputLabel, ListItemText, MenuItem, Select, withStyles} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import * as _ from 'lodash';
import React from 'react';
import PropTypes from "react-props";

const PropertySelector = ({classes, t, disabled, value, open, handleClose, handleChange, handleOpen, nodeProperties, required}) => (
    <FormControl classes={classes} disabled={disabled}>
        <InputLabel shrink htmlFor="property-name">
            <Typography color="alpha" variant="zeta">
                {t(`label.sdlGeneratorTools.createTypes.selectNodeProperty.${required ? 'required' : 'default'}`)}
            </Typography>
        </InputLabel>
        <Select disabled={disabled}
                open={open}
                value={value}
                input={<Input id="property-name"/>}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {
                !_.isNil(nodeProperties) ? nodeProperties.map((property, index) => (
                    <MenuItem key={`${property.name}_${index}`} value={property.name} classes={{root: classes.menuItem}}>
                        <ListItemText primary={property.displayName} secondary={property.displayType}/>
                    </MenuItem>
                )) : null
            }
        </Select>
    </FormControl>
);

PropertySelector.propTypes = {
    t: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    required: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    nodeProperties: PropTypes.array.isRequired
};

export default withStyles({
    root: {
        margin: '0px 0px',
        width: '100%'
    },
    menuItem: {
        padding: '15px 12px'
    },
    formControl: {
        margin: '0px 0px',
        width: '100%'
    }
})(PropertySelector);
