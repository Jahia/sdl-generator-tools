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
import {
    lookUpMappingStringArgumentInfo,
    generateFinderSuffix,
    upperCaseFirst,
    getAvailableTypeNames,
    getAvailablePropertyNames, formatFinderName
} from '../../StepperComponent.utils';
import {Close} from '@material-ui/icons';
import C from '../../../App.constants';
import gqlQueries from '../CreateTypes.gql-queries';
import {
    sdlAddPropertyToType,
    sdlRemoveFinderFromType,
    sdlRemovePropertyFromType,
    sdlUpdatePropertyOfType,
    sdlModifyFinderOfType
} from '../../../App.redux-actions';
import {
    sdlUpdateSelectedProperty,
    sdlUpdateAddModifyPropertyDialog,
    sdlSelectProperty
} from '../../StepperComponent.redux-actions';
import PredefinedTypeSelector from './PredefinedTypeSelector';
import PropertySelector from './PropertySelector';

const resolveSelectedProp = (object, key, optionalReturnValue = '') => {
    if (!_.isEmpty(object) && object[key]) {
        return object[key];
    }

    return optionalReturnValue;
};

const removeNodeTypePrefix = type => (type.replace(/(j:|jcr:)/, ''));

const sortProperties = nodeProperties => {
    const propertyItems = nodeProperties.map(property => {
        return {
            name: (property.name === C.MULTIPLE_CHILDREN_INDICATOR) ? property.name + property.requiredType : property.name,
            displayName: removeNodeTypePrefix(property.name),
            requiredType: property.requiredType,
            displayType: upperCaseFirst(property.requiredType.toLowerCase())
        };
    });

    return _.sortBy(propertyItems, [item => item.displayName.toLowerCase()]);
};

const ContentSwitch = ({mode, t, channel, updateSelectedProp, addPropertyAndClose, availableNodeTypes, selectedProperty, selectJCRProperty, nodeProperties, duplicateName, cancelAndClose, selectChannel, removeAndClose}) => {
    if (channel === C.CHANNEL_PROPERTY) {
        return (
            <PropertyChannel t={t}
                             mode={mode}
                             updateSelectedProp={updateSelectedProp}
                             addPropertyAndClose={addPropertyAndClose}
                             selectedProperty={selectedProperty}
                             selectJCRProperty={selectJCRProperty}
                             nodeProperties={nodeProperties}
                             duplicateName={duplicateName}
                             cancelAndClose={cancelAndClose}
                             removeAndClose={removeAndClose}/>
        );
    }
    if (channel === C.CHANNEL_MAP_TO_TYPE) {
        return (
            <TypeMappingChannel t={t}
                                mode={mode}
                                availableNodeTypes={availableNodeTypes}
                                updateSelectedProp={updateSelectedProp}
                                addPropertyAndClose={addPropertyAndClose}
                                selectedProperty={selectedProperty}
                                selectJCRProperty={selectJCRProperty}
                                nodeProperties={nodeProperties}
                                duplicateName={duplicateName}
                                cancelAndClose={cancelAndClose}
                                removeAndClose={removeAndClose}/>
        );
    }

    return (
        <ChannelSelect t={t}
                       selectChannel={selectChannel}
                       updateSelectedProp={updateSelectedProp}/>
    );
};

const AddModifyPropertyDialog = ({data, t, open, closeDialog, mode, channel, availableNodeTypes, selection, selectedType, availableProperties, selectedProperty, addProperty, removeProperty, removeFinder, updateSelectedProp, updateProperty, selectChannel}) => {
    const nodes = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : [];
    let nodeProperties = nodes.length > 0 ? nodes[0].properties : [];

    const selectionId = !_.isNil(selection) ? selection : '';
    const selectedPropertyName = resolveSelectedProp(selectedProperty, 'propertyName');
    const oldPropertyName = resolveSelectedProp(selectedProperty, 'oldPropertyName');
    const selectedJcrPropertyName = resolveSelectedProp(selectedProperty, 'jcrPropertyName');
    const selectedPropertyType = resolveSelectedProp(selectedProperty, 'propertyType');
    const selectedIsPredefinedType = resolveSelectedProp(selectedProperty, 'isPredefinedType', false);

    if (selectedIsPredefinedType) {
        if (channel !== C.CHANNEL_MAP_TO_TYPE) {
            selectChannel(C.CHANNEL_MAP_TO_TYPE);
        }

        nodeProperties = nodeProperties.filter(props => ['WEAKREFERENCE'].indexOf(props.requiredType) !== -1);

        if (nodes.length > 0) {
            nodeProperties = nodeProperties.concat(nodes[0].childNodes.map(node => ({
                name: node.name,
                requiredType: node.requiredPrimaryType[0].name
            })));
        }
    } else {
        if (mode === C.DIALOG_MODE_EDIT && channel !== C.CHANNEL_PROPERTY) {
            selectChannel(C.CHANNEL_PROPERTY);
        }

        nodeProperties = nodeProperties
            .filter(props => ['WEAKREFERENCE', 'REFERENCE'].indexOf(props.requiredType) === -1 && C.RESERVED_JCR_TYPES.indexOf(props.name) === -1);
    }

    const duplicateName = (mode === C.DIALOG_MODE_EDIT && oldPropertyName.toLowerCase() === selectedPropertyName.toLowerCase()) ? false : (availableProperties.find(prop => prop.toLowerCase() === selectedPropertyName.toLowerCase()) !== undefined);

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

        if (jcrPropName.startsWith(C.MULTIPLE_CHILDREN_INDICATOR)) {
            jcrPropName = '';
        }

        if (mode === C.DIALOG_MODE_EDIT) {
            updateProperty({
                name: selectedPropertyName,
                property: jcrPropName,
                type: propType
            }, selectionId, selectedProperty.propertyIndex, oldPropertyName, selection, selectedType);
        } else {
            addProperty({name: selectedPropertyName, property: jcrPropName, type: propType}, selectionId);
        }

        closeDialog();
    };

    const removeAndClose = () => {
        removeProperty(selectedProperty.propertyIndex, selectionId);
        removeFinders();
        closeDialog();
    };

    const removeFinders = () => {
        let suffix = generateFinderSuffix(selectedProperty.propertyName);
        let finders = selectedType.queries.filter(f => f.suffix === suffix.standard || f.suffix === suffix.connection);
        return finders.map(finder => removeFinder(selection, finder.name));
    };

    const selectJCRProperty = event => {
        const value = event.target.value;
        let isList = false;

        const prop = nodeProperties.find(p => p.name === value);
        if (value.startsWith(C.MULTIPLE_CHILDREN_INDICATOR)) {
            isList = true;
        } else {
            isList = prop.multiple !== undefined ? prop.multiple : false;
        }
        let selectedProp = {
            jcrPropertyName: value,
            isListType: isList
        };
        // Only preset custom property name if this dialog is property (not map to type)
        if (channel === 'PROPERTY') {
            selectedProp.propertyName = _.camelCase(removeNodeTypePrefix(prop.name));
        }
        updateSelectedProp(selectedProp);
    };

    return (
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
            onClose={closeDialog}
        >
            <ContentSwitch
                mode={mode}
                t={t}
                channel={channel}
                availableNodeTypes={availableNodeTypes}
                updateSelectedProp={updateSelectedProp}
                addPropertyAndClose={addPropertyAndClose}
                selectedProperty={selectedProperty}
                selectJCRProperty={selectJCRProperty}
                nodeProperties={nodeProperties}
                duplicateName={duplicateName}
                cancelAndClose={closeDialog}
                selectChannel={selectChannel}
                removeAndClose={removeAndClose}
            />
        </Dialog>
    );
};

const PropertyChannel = ({t, mode, updateSelectedProp, addPropertyAndClose, selectedProperty, cancelAndClose, selectJCRProperty, nodeProperties, duplicateName, removeAndClose}) => {
    const selectedPropertyName = resolveSelectedProp(selectedProperty, 'propertyName');
    const selectedJcrPropertyName = resolveSelectedProp(selectedProperty, 'jcrPropertyName');

    const [showPropertySelector, setShowPropertySelector] = useState(false);
    return (
        <React.Fragment>
            <DialogTitle
                id="form-dialog-title"
            >{mode === C.DIALOG_MODE_EDIT ? t('label.sdlGeneratorTools.createTypes.viewProperty') : t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
            </DialogTitle>
            <DialogContent style={{width: 400}}>
                <PropertySelector open={showPropertySelector}
                                  t={t}
                                  nodeProperties={sortProperties(nodeProperties)}
                                  value={selectedJcrPropertyName}
                                  handleOpen={() => setShowPropertySelector(true)}
                                  handleClose={() => setShowPropertySelector(false)}
                                  handleChange={selectJCRProperty}/>
                <TextField
                    autoFocus
                    fullWidth
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
                    error={duplicateName}
                    onKeyPress={e => {
                        if (e.key === 'Enter' && !duplicateName) {
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
                    <Button color="primary"
                            onClick={removeAndClose}
                    >
                        <Typography color="inherit" variant="zeta">
                            {t('label.sdlGeneratorTools.deleteButton')}
                        </Typography>
                        <Close/>
                    </Button>
                }
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant="contained" onClick={cancelAndClose}>
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.cancelButton')}
                    </Typography>
                </Button>
                <Button disabled={duplicateName}
                        color="primary"
                        variant="contained"
                        onClick={addPropertyAndClose}
                >
                    <Typography color="inherit" variant="zeta">
                        {mode === C.DIALOG_MODE_ADD ? t('label.sdlGeneratorTools.addButton') : t('label.sdlGeneratorTools.updateButton')}
                    </Typography>
                </Button>
            </DialogActions>
        </React.Fragment>
    );
};

const TypeMappingChannel = ({t, mode, updateSelectedProp, addPropertyAndClose, availableNodeTypes, selectedProperty, cancelAndClose, removeAndClose, selectJCRProperty, nodeProperties, duplicateName}) => {
    const selectedPropertyName = resolveSelectedProp(selectedProperty, 'propertyName');
    const selectedJcrPropertyName = resolveSelectedProp(selectedProperty, 'jcrPropertyName');
    const selectedPropertyType = resolveSelectedProp(selectedProperty, 'propertyType');
    const selectedIsListType = resolveSelectedProp(selectedProperty, 'isListType', false);

    const [showPropertySelector, setShowPropertySelector] = useState(false);
    const [showPredefinedTypeSelector, setPredefinedTypeSelector] = useState(false);

    const filterProperties = props => {
        return props.filter(prop => ['jnt:translation', 'jnt:conditionalVisibility'].indexOf(prop.requiredType) === -1);
    };

    return (
        <React.Fragment>
            <DialogTitle
                id="form-dialog-title"
            >{mode === C.DIALOG_MODE_EDIT ? t('label.sdlGeneratorTools.createTypes.viewProperty') : t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
            </DialogTitle>
            <DialogContent style={{width: 400}}>
                <PredefinedTypeSelector t={t}
                                        open={showPredefinedTypeSelector}
                                        types={C.PREDEFINED_SDL_TYPES.concat(availableNodeTypes)}
                                        value={selectedPropertyType.replace(/(\[|])/g, '')}
                                        handleOpen={() => setPredefinedTypeSelector(true)}
                                        handleClose={() => setPredefinedTypeSelector(false)}
                                        handleChange={event => updateSelectedProp({propertyType: event.target.value, propertyName: _.camelCase(event.target.value)})}/>
                <PropertySelector open={showPropertySelector}
                                  t={t}
                                  nodeProperties={sortProperties(filterProperties(nodeProperties))}
                                  value={selectedJcrPropertyName}
                                  handleOpen={() => setShowPropertySelector(true)}
                                  handleClose={() => setShowPropertySelector(false)}
                                  handleChange={selectJCRProperty}/>
                <TextField
                    autoFocus
                    fullWidth
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
                    error={duplicateName}
                    onKeyPress={e => {
                        if (e.key === 'Enter' && !duplicateName) {
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
                    <Button color="primary"
                            onClick={removeAndClose}
                    >
                        <Typography color="inherit" variant="zeta">
                            {t('label.sdlGeneratorTools.deleteButton')}
                        </Typography>
                        <Close/>
                    </Button>
                }
            </DialogContent>
            <DialogActions>
                <Button color="primary"
                        variant="contained"
                        onClick={cancelAndClose}
                >
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.cancelButton')}
                    </Typography>
                </Button>
                <Button disabled={mode === C.DIALOG_MODE_ADD ? duplicateName : false}
                        color="primary"
                        variant="contained"
                        onClick={addPropertyAndClose}
                >
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.saveButton')}
                    </Typography>
                </Button>
            </DialogActions>
        </React.Fragment>
    );
};

const ChannelSelect = ({t, selectChannel, updateSelectedProp}) => (
    <React.Fragment>
        <DialogContent style={{width: 400}}>
            <FormGroup>
                <Button color="primary"
                        variant="contained"
                        onClick={() => {
                            updateSelectedProp({isPredefinedType: true, jcrPropertyName: ''});
                            selectChannel('MAP_TO_TYPE');
                        }}
                >
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.createProperty.mapToType')}
                    </Typography>
                </Button>
                <Button color="primary"
                        variant="contained"
                        onClick={() => selectChannel('PROPERTY')}
                >
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.createProperty.selectProp')}
                    </Typography>
                </Button>
            </FormGroup>
        </DialogContent>
    </React.Fragment>
);

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
        availableProperties: getAvailablePropertyNames(state.nodeTypes[state.selection]),
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
        updateProperty: (propertyInfo, typeIndex, propIndex, oldPropertyName, selection, selectedType) => {
            dispatch(sdlUpdatePropertyOfType(propertyInfo, typeIndex, propIndex));
            ['', 'Connection'].forEach(finder => {
                const suffix = 'by' + upperCaseFirst(oldPropertyName) + finder;
                const index = _.isNil(selectedType.queries) ? -1 : selectedType.queries.findIndex(query => query.suffix === suffix);
                if (index !== -1) {
                    const finderInfo = selectedType.queries[index];
                    const finderPrefix = finderInfo.prefix;
                    const finderSuffix = 'by' + upperCaseFirst(propertyInfo.name) + finder;
                    dispatch(sdlModifyFinderOfType(selection, index, {name: formatFinderName(finderPrefix, finderSuffix), prefix: finderPrefix, suffix: finderSuffix}));
                }
            });
        },
        updateSelectedProp: propertyFields => dispatch(sdlUpdateSelectedProperty(propertyFields)),
        removeProperty: (propertyIndex, typeIndexOrName) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndexOrName)),
        removeFinder: (uuid, finderIndex) => dispatch(sdlRemoveFinderFromType(uuid, finderIndex)),
        closeDialog: () => {
            dispatch(sdlUpdateAddModifyPropertyDialog({open: false, mode: C.DIALOG_MODE_ADD}));
            dispatch(sdlSelectProperty('', '', '', ''));
        },
        selectChannel: channel => dispatch(sdlUpdateAddModifyPropertyDialog({channel: channel}))
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
