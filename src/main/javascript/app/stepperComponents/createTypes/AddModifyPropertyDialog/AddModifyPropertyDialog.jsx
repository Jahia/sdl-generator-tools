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
import {upperCaseFirst} from '../../../util/helperFunctions';

const PropertySelectCom = ({classes, value, open, handleClose, handleChange, handleOpen, nodeProperties}) => (
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

const AddModifyPropertyDialog = ({data, t, open, closeDialog, customTypeName, jcrNodeType, addProperty, typeName, isDuplicatedPropertyName}) => {
    const [propertyName, updatePropertyName] = useState(customTypeName);
    const [jcrPropertyName, updateJcrPropertyName] = useState(jcrNodeType);
    const [showPropertySelector, setShowPropertySelector] = useState(false);

    const nodes = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : null;
    const nodeProperties = !_.isNil(nodes) && nodes.length > 0 ? nodes[0].properties : null;

    const cleanUp = () => {
        updatePropertyName(null);
        updateJcrPropertyName(null);
    };

    const addPropertyAndClose = () => {
        if (_.isNil(propertyName) || _.isNil(jcrPropertyName) || isDuplicatedPropertyName(propertyName)) {
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

    return (
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
            onClose={closeDialog}
        >
            <DialogTitle id="form-dialog-title">{t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}</DialogTitle>
            <DialogContent style={{width: 400}}>
                <PropertySelect open={showPropertySelector}
                                nodeProperties={nodeProperties}
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
                    error={isDuplicatedPropertyName(propertyName)}
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
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={cancelAndClose}>
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

const getNodeTypeInfo = selectedType => {
    if (!_.isNil(selectedType) && !_.isNil(selectedType.directives) && selectedType.directives.length > 0) {
        for (let directive of selectedType.directives) {
            if (directive.name === 'mapping') {
                for (let argument of directive.arguments) {
                    if (argument.name === 'node') {
                        return argument.value;
                    }
                }
            }
        }
    }

    return '';
};

const CompositeComp = compose(
    graphql(gqlQueries.NODE_TYPE_PROPERTIES, {
        options(props) {
            return {
                variables: {
                    includeTypes: [getNodeTypeInfo(props.selectedType)]
                },
                fetchPolicy: 'network-only'
            };
        }
    }),
    translate()
)(AddModifyPropertyDialog);

export default withApollo(CompositeComp);
