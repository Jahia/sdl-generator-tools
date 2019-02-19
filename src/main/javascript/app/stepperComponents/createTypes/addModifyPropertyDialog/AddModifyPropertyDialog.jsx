import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {Button, MenuItem, Select} from '@material-ui/core';
import {translate} from "react-i18next";

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

const AddModifyPropertyDialog = ({t, open, closeDialog, customTypeName, jcrNodeType, addProperty, typeName}) => {
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
            <DialogTitle id="form-dialog-title">{t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}</DialogTitle>
            <DialogContent style={{width: 400}}>
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
                    label={t('label.sdlGeneratorTools.createTypes.customPropertyNameText')}
                    type="text"
                    value={propertyName}
                    onChange={e => updatePropertyName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={closeDialog}>
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button color="primary"
                        onClick={addPropertyAndClose}
                >
                    {t('label.sdlGeneratorTools.addButton')}
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

export default translate()(AddModifyPropertyDialog);
