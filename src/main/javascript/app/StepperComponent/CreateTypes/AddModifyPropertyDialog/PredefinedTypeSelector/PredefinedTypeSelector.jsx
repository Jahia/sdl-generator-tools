import {FormControl, InputLabel, ListItemText, MenuItem, Select, withStyles} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import React from 'react';

const PredefinedTypeSelector = ({t, classes, disabled, value, open, handleClose, handleChange, handleOpen, types}) => (
    <FormControl className={classes.formControl} disabled={disabled}>
        <InputLabel shrink htmlFor="type-name">
            <Typography color="alpha" variant="zeta">
                {t('label.sdlGeneratorTools.createTypes.predefinedType')}
            </Typography>
        </InputLabel>
        <Select disabled={disabled}
                open={open}
                value={value}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {
                types.map(type => (
                    <MenuItem key={type} value={type} classes={classes}>
                        <ListItemText primary={type}/>
                    </MenuItem>
                ))
            }
        </Select>
    </FormControl>
);

export default withStyles({
    root: {
        padding: '15px 12px'
    },
    formControl: {
        margin: '0px 0px',
        width: '100%'
    }
})(PredefinedTypeSelector);
