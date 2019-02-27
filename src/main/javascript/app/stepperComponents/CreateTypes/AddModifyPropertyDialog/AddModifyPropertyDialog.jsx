import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {Button, ListItemText, MenuItem, Select, withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import {compose, graphql, withApollo} from 'react-apollo';
import gqlQueries from '../../../gql/gqlQueries';
import * as _ from 'lodash';
import {lookUpMappingStringArgumentInfo, upperCaseFirst} from '../../../util/helperFunctions';
import {Close} from '@material-ui/icons';
import C from '../../../App.constants';

const PropertySelectCom = ({classes, disabled, value, open, handleClose, handleChange, handleOpen, nodeProperties}) => (
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
            !_.isNil(nodeProperties) ? nodeProperties.map(property => {
                return (
                    <MenuItem key={property.name} value={property.name} classes={classes}>
                        <ListItemText primary={property.name} secondary={upperCaseFirst(property.requiredType.toLowerCase())}/>
                    </MenuItem>
                );
            }) : null
        }
    </Select>
);

const PropertySelect = withStyles({
    root: {
        padding: '15px 12px'
    }
})(PropertySelectCom);

const AddModifyPropertyDialog = ({data, t, open, closeDialog, mode, selectedType, selectedProperty, addProperty, removeProperty, isDuplicatedPropertyName}) => {
    const typeName = !_.isNil(selectedType) ? selectedType.name : '';
    const selectedPropertyName = !_.isNil(selectedProperty) ? selectedProperty.propertyName : '';
    const selectedJcrPropertyName = !_.isNil(selectedProperty) ? selectedProperty.jcrPropertyName : '';
    const [propertyName, updatePropertyName] = useState(selectedPropertyName);
    const [jcrPropertyName, updateJcrPropertyName] = useState(selectedJcrPropertyName);
    const [showPropertySelector, setShowPropertySelector] = useState(false);

    const nodes = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : null;
    const nodeProperties = !_.isNil(nodes) && nodes.length > 0 ? nodes[0].properties : null;

    const cleanUp = () => {
        updatePropertyName(null);
        updateJcrPropertyName(null);
    };

    const duplicateName = isDuplicatedPropertyName(propertyName);

    const addPropertyAndClose = () => {
        if (_.isNil(propertyName) || _.isEmpty(propertyName) || _.isNil(jcrPropertyName) || _.isEmpty(jcrPropertyName)) {
            return;
        }
        addProperty({name: propertyName, property: jcrPropertyName, type: 'String'}, typeName);
        closeDialog();
        cleanUp();
    };

    const cancelAndClose = () => {
        closeDialog();
        cleanUp();
    };

    const removeAndClose = () => {
        removeProperty(selectedProperty.propertyIndex, typeName);
        closeDialog();
        cleanUp();
    };

    const openDialog = (mode, selectedPropertyName, selectedJcrPropertyName) => {
        if (mode === C.DIALOG_MODE_EDIT) {
            updatePropertyName(selectedPropertyName);
            updateJcrPropertyName(selectedJcrPropertyName);
        }
    };

    return (
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
            onClose={closeDialog}
            onEnter={() => {
                openDialog(mode, selectedPropertyName, selectedJcrPropertyName);
            }}
        >
            <DialogTitle id="form-dialog-title">{mode === C.DIALOG_MODE_EDIT ? t('label.sdlGeneratorTools.createTypes.viewProperty') : t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}</DialogTitle>
            <DialogContent style={{width: 400}}>
                <PropertySelect open={showPropertySelector}
                                disabled={mode === C.DIALOG_MODE_EDIT}
                                nodeProperties={nodeProperties}
                                value={jcrPropertyName}
                                handleOpen={() => setShowPropertySelector(true)}
                                handleClose={() => setShowPropertySelector(false)}
                                handleChange={event => updateJcrPropertyName(event.target.value)}/>
                <TextField
                    autoFocus
                    fullWidth
                    disabled={mode === C.DIALOG_MODE_EDIT}
                    margin="dense"
                    id="propertyName"
                    label={t('label.sdlGeneratorTools.createTypes.customPropertyNameText')}
                    type="text"
                    value={propertyName}
                    error={mode === C.DIALOG_MODE_ADD ? duplicateName : false}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            addPropertyAndClose();
                        } else if (e.which === 32) {
                            e.preventDefault();
                            return false;
                        }
                    }}
                    onChange={e => updatePropertyName(e.target.value)}
                />
                {
                    mode === C.DIALOG_MODE_EDIT &&
                    <Button color="primary" onClick={removeAndClose}>
                        {t('label.sdlGeneratorTools.deleteButton')}
                        <Close/>
                    </Button>
                }
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={cancelAndClose}>
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button disabled={mode === C.DIALOG_MODE_EDIT || duplicateName}
                        color="primary"
                        onClick={addPropertyAndClose}
                >
                    {t('label.sdlGeneratorTools.saveButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddModifyPropertyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired,
    selectedProperty: PropTypes.object
};

AddModifyPropertyDialog.defaultProps = {
    selectedProperty: {}
};

const CompositeComp = compose(
    graphql(gqlQueries.NODE_TYPE_PROPERTIES, {
        options(props) {
            return {
                variables: {
                    includeTypes: [lookUpMappingStringArgumentInfo(props.selectedType, 'node')]
                },
                fetchPolicy: 'network-only'
            };
        }
    }),
    translate()
)(AddModifyPropertyDialog);

export default withApollo(CompositeComp);