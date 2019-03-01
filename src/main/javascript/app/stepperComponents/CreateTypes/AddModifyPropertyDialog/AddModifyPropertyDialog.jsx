import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {
    Button,
    FormControlLabel,
    FormGroup,
    ListItemText,
    MenuItem,
    Select,
    Switch,
    withStyles
} from '@material-ui/core';
import {compose, graphql, withApollo} from 'react-apollo';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import * as _ from 'lodash';
import {lookUpMappingStringArgumentInfo, upperCaseFirst} from '../../../util/helperFunctions';
import {Close} from '@material-ui/icons';
import C from '../../../App.constants';
import gqlQueries from "../../../gql/gqlQueries";
import {sdlAddPropertyToType, sdlRemovePropertyFromType} from "../../../App.redux-actions";
import {sdlUpdateSelectedProperty, sdlUpdateAddModifyPropertyDialog} from "../../StepperComponent.redux-actions";


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

const PredefinedTypeSelector = ({classes, disabled, value, open, handleClose, handleChange, handleOpen, types}) => (
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
                <MenuItem key={type} value={type} classes={classes} >
                    <ListItemText primary={type}/>
                </MenuItem>
                ))
        }
    </Select>
);

const PropertySelect = withStyles({
    root: {
        padding: '15px 12px'
    }
})(PropertySelectCom);

const AddModifyPropertyDialog = ({data, t, open, closeDialog, mode, definedTypes, selectedType, selectedProperty, addProperty, removeProperty, isDuplicatedPropertyName, updateSelectedProp}) => {
    const nodes = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : [];
    let nodeProperties = nodes.length > 0 ? nodes[0].properties : [];

    const typeName = !_.isNil(selectedType) ? selectedType : '';
    const selectedPropertyName = !_.isNil(selectedProperty) ? selectedProperty.propertyName : '';
    const selectedJcrPropertyName = !_.isNil(selectedProperty) ? selectedProperty.jcrPropertyName : '';
    const selectedPropertyType = !_.isNil(selectedProperty) ? selectedProperty.propertyType : '';
    const selectedIsPredefinedType = !_.isNil(selectedProperty) ? selectedProperty.isPredefinedType : false;
    const selectedIsListType = !_.isNil(selectedProperty) ? selectedProperty.isListType : false;

    const [showPropertySelector, setShowPropertySelector] = useState(false);
    const [showPredefinedTypeSelector, setPredefinedTypeSelector] = useState(false);

    if (selectedIsPredefinedType) {
        nodeProperties = nodeProperties.filter(props => ["WEAKREFERENCE"].indexOf(props.requiredType) !== -1);

        if (nodes.length > 0) {
            nodeProperties = nodeProperties.concat(nodes[0].childNodes.map(node => ({
                name: node.name,
                requiredType: node.requiredPrimaryType[0].name
            })));
        }
    }

    const cleanUp = () => {
        updateSelectedProp('', '', '', '');
    };

    const duplicateName = false;//isDuplicatedPropertyName(selectedPropertyName);

    const addPropertyAndClose = () => {
        // if (_.isNil(selectedPropertyName) || _.isEmpty(selectedPropertyName) || _.isNil(selectedJcrPropertyName) || _.isEmpty(selectedJcrPropertyName)) {
        //     return;
        // }

        let propType;

        if (selectedIsPredefinedType) {
            propType = selectedPropertyType;
        }
        else {
            propType = nodeProperties.find(prop => prop.name === selectedJcrPropertyName).requiredType;
            propType = C.JCR_TO_SDL_TYPE_MAP[propType];
        }

        propType = selectedProperty.isListType && !propType.startsWith("[") ? `[${propType}]` : propType;

        console.log("Saved prop", propType, typeName);

        addProperty({name: selectedPropertyName, property: selectedJcrPropertyName, type: propType}, typeName);
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
                <FormGroup row>
                    <FormControlLabel
                        label={t('label.sdlGeneratorTools.createTypes.mapToCustomType')}
                        control={
                            <Switch
                                color="primary"
                                checked={selectedIsPredefinedType}
                                onChange={e => updateSelectedProp({ isPredefinedType: e.target.checked})}
                            />
                        }/>
                    <FormControlLabel
                        label={"As list"}
                        control={
                            <Switch
                                color="primary"
                                checked={selectedIsListType}
                                onChange={() => updateSelectedProp({isListType: !selectedIsListType})}
                            />
                        }/>
                </FormGroup>
                {
                    selectedIsPredefinedType &&
                    <PredefinedTypeSelector open={showPredefinedTypeSelector}
                                    types={C.PREDEFINED_SDL_TYPES.concat(definedTypes)}
                                    value={selectedPropertyType.replace(/\[/g, "")}
                                    handleOpen={() => setPredefinedTypeSelector(true)}
                                    handleClose={() => setPredefinedTypeSelector(false)}
                                    handleChange={event => updateSelectedProp({propertyType: event.target.value})}/>
                }
                <PropertySelect open={showPropertySelector}
                                disabled={mode === C.DIALOG_MODE_EDIT}
                                nodeProperties={nodeProperties}
                                value={selectedJcrPropertyName}
                                handleOpen={() => setShowPropertySelector(true)}
                                handleClose={() => setShowPropertySelector(false)}
                                handleChange={event => updateSelectedProp({jcrPropertyName: event.target.value})}/>
                <TextField
                    autoFocus
                    fullWidth
                    disabled={mode === C.DIALOG_MODE_EDIT}
                    margin="dense"
                    id="propertyName"
                    label={t('label.sdlGeneratorTools.createTypes.customPropertyNameText')}
                    type="text"
                    value={selectedPropertyName}
                    error={mode === C.DIALOG_MODE_ADD ? duplicateName : false}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            addPropertyAndClose();
                        } else if (e.which === 32) {
                            e.preventDefault();
                            return false;
                        }
                    }}
                    onChange={e => updateSelectedProp({propertyName: e.target.value})}
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
                <Button
                        //disabled={duplicateName}
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
    mode: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired,
    updateSelectedProp: PropTypes.func.isRequired,
    // isDuplicatedPropertyName: PropTypes.func.isRequired,
    selectedProperty: PropTypes.object,
    selectedType: PropTypes.string.isRequired
};

const getJCRType = (nodeTypes, selection) => {
    if (nodeTypes && nodeTypes[0] && selection) {
        const node = nodeTypes.find(node => node.name === selection);
        return node.directives[0].arguments.find(arg => arg.name === 'node').value
    }
    return '';
};

const getDefinedTypes = (nodeTypes, selection) => {
    if (nodeTypes && nodeTypes[0] && selection) {
        return nodeTypes.reduce((acc, node) => {
            if (node.name !== selection) {
                acc.push(node.name)
            }
            return acc;
        }, [])
    }
    return [];
};

const mapStateToProps = state => {
    //TODO we need better management of node type selection
    return {
        definedTypes: getDefinedTypes(state.nodeTypes, state.selection),
        jcrType: getJCRType(state.nodeTypes, state.selection),
        selectedType: state.selection,
        selectedProperty: state.selectedProperty,
        ...state.addModifyPropertyDialog
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addProperty: (propertyInfo, typeIndex) => dispatch(sdlAddPropertyToType(propertyInfo, typeIndex)),
        updateSelectedProp: propertyFields => dispatch(sdlUpdateSelectedProperty(propertyFields)),
        removeProperty: (propertyIndex, typeIndexOrName) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndexOrName)),
        closeDialog: () => dispatch(sdlUpdateAddModifyPropertyDialog({open: false}))
    };
};

const CompositeComp = compose(
    connect(mapStateToProps, mapDispatchToProps),
    graphql(gqlQueries.NODE_TYPE_PROPERTIES, {
        options(props) {
            console.log("D", props, lookUpMappingStringArgumentInfo(props.selectedType, 'node'));
            return {
                variables: {
                    includeTypes: [props.jcrType]
                },
                fetchPolicy: 'cache-first'
            };
        }
    }),
    translate()
)(AddModifyPropertyDialog);

export default withApollo(CompositeComp);
