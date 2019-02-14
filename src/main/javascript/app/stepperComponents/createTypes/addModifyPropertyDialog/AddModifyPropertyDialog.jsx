import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {Button, MenuItem, Select} from '@material-ui/core';

const PropertySelect = ({value, open, handleClose, handleChange, handleOpen}) => (
    <Select
        open={open}
        value={value}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={handleChange}
    >
        <MenuItem value="">
            <em>None</em>
        </MenuItem>
        <MenuItem value="text">text</MenuItem>
    </Select>
);

const AddModifyPropertyDialog = ({open, closeDialog, customTypeName, jcrNodeType, addProperty, typeName}) => {
    const [propertyName, updatePropertyName] = useState(customTypeName);
    const [jcrPropertyName, updateJcrPropertyName] = useState(jcrNodeType);
    const [showPropertySelector, setShowPropertySelector] = useState(false);

    function addPropertyAndClose() {
        addProperty({name: propertyName, property: jcrPropertyName, type: 'String'}, typeName);
        closeDialog();
    }

    return (
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
            onClose={closeDialog}
        >
            <DialogTitle id="form-dialog-title">Add new property</DialogTitle>
            <DialogContent>
                <PropertySelect open={showPropertySelector}
                                value={jcrPropertyName}
                                handleOpen={() => setShowPropertySelector(true)}
                                handleClose={() => setShowPropertySelector(false)}
                                handleChange={event => updateJcrPropertyName(event.target.value)}/>
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="propertyName"
                    label="Custom property name"
                    type="text"
                    value={propertyName}
                    onChange={e => updatePropertyName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={closeDialog}>
                    Cancel
                </Button>
                <Button color="primary"
                        onClick={addPropertyAndClose}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddModifyPropertyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    typeName: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired
};

AddModifyPropertyDialog.defaultProps = {
    customTypeName: '',
    jcrNodeType: ''
};

export default AddModifyPropertyDialog;
