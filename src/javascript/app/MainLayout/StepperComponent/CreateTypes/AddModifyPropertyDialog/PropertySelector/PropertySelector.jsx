import {FormControl, Input, InputLabel, ListItemText, MenuItem, Select, withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';
import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

const PropertySelector = ({classes, t, isDisabled, value, isOpen, handleClose, handleChange, handleOpen, nodeProperties, isRequired}) => (
    <FormControl classes={classes} disabled={isDisabled}>
        <InputLabel shrink htmlFor="property-name">
            <Typography color="alpha" variant="zeta">
                {t(`label.sdlGeneratorTools.createTypes.selectNodeProperty.${isRequired ? 'required' : 'default'}`)}
            </Typography>
        </InputLabel>
        <Select disabled={isDisabled}
                open={isOpen}
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
                _.isNil(nodeProperties) ? null : nodeProperties.map((property, i) => (
                    /* eslint-disable-next-line */
                    <MenuItem key={`${property.name}_${i}`} value={property.name} classes={{root: classes.menuItem}}>
                        <ListItemText primary={property.displayName} secondary={property.displayType}/>
                    </MenuItem>
                ))
            }
        </Select>
    </FormControl>
);

PropertySelector.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
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
