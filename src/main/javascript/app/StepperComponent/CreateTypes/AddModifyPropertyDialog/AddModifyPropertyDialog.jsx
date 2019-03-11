import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {
    Button, FormControl,
    FormControlLabel,
    FormGroup, Input, InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Switch,
    withStyles
} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import {compose, graphql, withApollo} from 'react-apollo';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import * as _ from 'lodash';
import {lookUpMappingStringArgumentInfo, generateFinderSuffix, upperCaseFirst, getAvailableTypeNames} from '../../StepperComponent.utils';
import {Close} from '@material-ui/icons';
import C from '../../../App.constants';
import gqlQueries from '../CreateTypes.gql-queries';
import {
    sdlAddPropertyToType,
    sdlRemoveFinderFromType,
    sdlRemovePropertyFromType,
    sdlUpdatePropertyOfType
} from '../../../App.redux-actions';
import {sdlUpdateSelectedProperty, sdlUpdateAddModifyPropertyDialog, sdlSelectProperty} from '../../StepperComponent.redux-actions';

const MULTIPLE_CHILDREN_INDICATOR = '*';

const PropertySelectCom = ({classes, t, disabled, value, open, handleClose, handleChange, handleOpen, nodeProperties}) => (
    <FormControl classes={classes} disabled={disabled}>
        <InputLabel shrink htmlFor="property-name">
            <Typography color="alpha" variant="zeta">
                {t('label.sdlGeneratorTools.createTypes.selectNodeProperty')}
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

const PropertySelect = withStyles({
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
})(PropertySelectCom);

const PredefinedTypeSelect = withStyles({
    root: {
        padding: '15px 12px'
    },
    formControl: {
        margin: '0px 0px',
        width: '100%'
    }
})(PredefinedTypeSelector);

const resolveSelectedProp = (object, key, optionalReturnValue = '') => {
    if (!_.isEmpty(object) && object[key]) {
        return object[key];
    }

    return optionalReturnValue;
};

const AddModifyPropertyDialog = ({data, t, open, closeDialog, mode, availableNodeTypes, selection, selectedType, selectedProperty, addProperty, removeProperty, removeFinder, updateSelectedProp, unselectProperty, updateProperty}) => {
    const nodes = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : [];
    let nodeProperties = nodes.length > 0 ? nodes[0].properties : [];

    const selectionId = !_.isNil(selection) ? selection : '';
    const selectedPropertyName = resolveSelectedProp(selectedProperty, 'propertyName');
    const selectedJcrPropertyName = resolveSelectedProp(selectedProperty, 'jcrPropertyName');
    const selectedPropertyType = resolveSelectedProp(selectedProperty, 'propertyType');
    const selectedIsPredefinedType = resolveSelectedProp(selectedProperty, 'isPredefinedType', false);
    const selectedIsListType = resolveSelectedProp(selectedProperty, 'isListType', false);

    const [showPropertySelector, setShowPropertySelector] = useState(false);
    const [showPredefinedTypeSelector, setPredefinedTypeSelector] = useState(false);

    if (selectedIsPredefinedType) {
        nodeProperties = nodeProperties.filter(props => ['WEAKREFERENCE'].indexOf(props.requiredType) !== -1);

        if (nodes.length > 0) {
            nodeProperties = nodeProperties.concat(nodes[0].childNodes.map(node => ({
                name: node.name,
                requiredType: node.requiredPrimaryType[0].name
            })));
        }
    } else {
        nodeProperties = nodeProperties
            .filter(props => ['WEAKREFERENCE', 'REFERENCE'].indexOf(props.requiredType) === -1 && C.RESERVED_JCR_TYPES.indexOf(props.name) === -1);
    }

    const cleanUp = () => {
        unselectProperty();
    };

    const duplicateName = false;

    const addPropertyAndClose = () => {
        let propType;
        let jcrPropName = selectedJcrPropertyName;

        if (selectedIsPredefinedType) {
            propType = selectedPropertyType;
        } else {
            propType = nodeProperties.find(prop => prop.name === selectedJcrPropertyName).requiredType;
            propType = C.JCR_TO_SDL_TYPE_MAP[propType];
        }

        if (selectedProperty.isListType && !propType.startsWith('[')) {
            propType = `[${propType}]`;
        } else if (!selectedProperty.isListType && propType.startsWith('[')) {
            propType = propType.replace(/(\[|])/g, '');
        }

        if (jcrPropName === MULTIPLE_CHILDREN_INDICATOR) {
            jcrPropName = '';
        }

        if (mode === C.DIALOG_MODE_EDIT) {
            updateProperty({name: selectedPropertyName, property: jcrPropName, type: propType}, selectionId, selectedProperty.propertyIndex);
        } else {
            addProperty({name: selectedPropertyName, property: jcrPropName, type: propType}, selectionId);
        }

        closeDialog();
        cleanUp();
    };

    const cancelAndClose = () => {
        closeDialog();
        cleanUp();
    };

    const removeAndClose = () => {
        removeProperty(selectedProperty.propertyIndex, selectionId);
        removeFinders();
        closeDialog();
        cleanUp();
    };

    const removeFinders = () => {
        let suffix = generateFinderSuffix(selectedProperty.propertyName);
        let finders = selectedType.queries.filter(f => f.suffix === suffix.standard || f.suffix === suffix.connection);
        return finders.map(finder => removeFinder(selection, finder.name));
    };

    const selectJCRProperty = event => {
        const value = event.target.value;
        let isList = false;

        if (value === MULTIPLE_CHILDREN_INDICATOR) {
            isList = true;
        } else {
            const prop = nodeProperties.find(p => p.name === value);
            isList = prop.multiple !== undefined ? prop.multiple : false;
        }

        updateSelectedProp({
            jcrPropertyName: value,
            isListType: isList
        });
    };

    const sortProperties = nodeProperties => {
        return _.sortBy(nodeProperties.map(property => {
            return {
                name: property.name,
                displayName: property.name.replace(/(j:|jcr:)/, ''),
                requiredType: property.requiredType,
                displayType: upperCaseFirst(property.requiredType.toLowerCase())
            };
        }), 'displayName');
    };

    return (
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
            onClose={closeDialog}
        >
            <DialogTitle id="form-dialog-title">{mode === C.DIALOG_MODE_EDIT ? t('label.sdlGeneratorTools.createTypes.viewProperty') : t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}</DialogTitle>
            <DialogContent style={{width: 400}}>
                {
                    selectedIsPredefinedType &&
                    <PredefinedTypeSelect t={t}
                                          open={showPredefinedTypeSelector}
                                          types={C.PREDEFINED_SDL_TYPES.concat(availableNodeTypes)}
                                          value={selectedPropertyType.replace(/(\[|])/g, '')}
                                          handleOpen={() => setPredefinedTypeSelector(true)}
                                          handleClose={() => setPredefinedTypeSelector(false)}
                                          handleChange={event => updateSelectedProp({propertyType: event.target.value})}/>
                }
                <PropertySelect open={showPropertySelector}
                                t={t}
                                disabled={mode === C.DIALOG_MODE_EDIT}
                                nodeProperties={sortProperties(nodeProperties)}
                                value={selectedJcrPropertyName}
                                handleOpen={() => setShowPropertySelector(true)}
                                handleClose={() => setShowPropertySelector(false)}
                                handleChange={selectJCRProperty}/>
                <TextField
                    autoFocus
                    fullWidth
                    disabled={mode === C.DIALOG_MODE_EDIT}
                    margin="dense"
                    id="propertyName"
                    InputLabelProps={{
                        shrink: true
                    }}
                    label={
                        <Typography color="alpha" variant="zeta">
                            {t('label.sdlGeneratorTools.createTypes.customPropertyNameText')}
                        </Typography>
                    }
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
                <FormGroup row>
                    <FormControlLabel
                        label={
                            <Typography color="alpha" variant="zeta">
                                {t('label.sdlGeneratorTools.createTypes.mapToCustomType')}
                            </Typography>
                        }
                        control={
                            <Switch
                                color="primary"
                                checked={selectedIsPredefinedType}
                                disabled={mode === C.DIALOG_MODE_EDIT}
                                onChange={e => updateSelectedProp({isPredefinedType: e.target.checked})}
                            />
                        }/>
                    <FormControlLabel
                        label={
                            <Typography color="alpha" variant="zeta">
                                {t('label.sdlGeneratorTools.createTypes.propertyAsList')}
                            </Typography>
                        }
                        control={
                            <Switch
                                color="primary"
                                checked={selectedIsListType}
                                onChange={() => updateSelectedProp({isListType: !selectedIsListType})}
                            />
                        }/>
                </FormGroup>
                {
                    mode === C.DIALOG_MODE_EDIT &&
                    <Button color="primary" onClick={removeAndClose}>
                        <Typography color="inherit" variant="zeta">
                            {t('label.sdlGeneratorTools.deleteButton')}
                        </Typography>
                        <Close/>
                    </Button>
                }
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={cancelAndClose}>
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.cancelButton')}
                    </Typography>
                </Button>
                <Button
                        // Disabled={duplicateName}
                        color="primary"
                        onClick={addPropertyAndClose}
                >
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.saveButton')}
                    </Typography>
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
    selectedProperty: PropTypes.object,
    selection: PropTypes.string
};

const getJCRType = (nodeTypes, selection) => {
    if (nodeTypes && selection) {
        const node = nodeTypes[selection];
        return lookUpMappingStringArgumentInfo(node, 'node');
    }
    return '';
};

const mapStateToProps = state => {
    return {
        availableNodeTypes: getAvailableTypeNames(state.nodeTypes, state.selection),
        jcrType: getJCRType(state.nodeTypes, state.selection),
        selection: state.selection,
        selectedType: state.nodeTypes[state.selection],
        selectedProperty: state.selectedProperty,
        ...state.addModifyPropertyDialog
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addProperty: (propertyInfo, typeIndex) => dispatch(sdlAddPropertyToType(propertyInfo, typeIndex)),
        updateProperty: (propertyInfo, typeIndex, propIndex) => dispatch(sdlUpdatePropertyOfType(propertyInfo, typeIndex, propIndex)),
        unselectProperty: () => dispatch(sdlSelectProperty('', '', '', '')),
        updateSelectedProp: propertyFields => dispatch(sdlUpdateSelectedProperty(propertyFields)),
        removeProperty: (propertyIndex, typeIndexOrName) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndexOrName)),
        removeFinder: (uuid, finderIndex) => dispatch(sdlRemoveFinderFromType(uuid, finderIndex)),
        closeDialog: () => dispatch(sdlUpdateAddModifyPropertyDialog({open: false}))
    };
};

const CompositeComp = compose(
    connect(mapStateToProps, mapDispatchToProps),
    graphql(gqlQueries.NODE_TYPE_PROPERTIES, {
        options(props) {
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
