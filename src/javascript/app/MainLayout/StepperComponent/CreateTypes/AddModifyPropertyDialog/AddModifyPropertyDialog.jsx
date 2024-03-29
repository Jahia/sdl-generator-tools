import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {FormControlLabel, FormGroup, Switch} from '@material-ui/core';
import {Button, Typography} from '@jahia/design-system-kit';
import {compose} from '../../../../compose';
import {graphql, withApollo} from 'react-apollo';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import * as _ from 'lodash';
import {
    formatFinderName,
    generateFinderSuffix,
    getAvailablePropertyNames,
    getAvailableTypeNames,
    lookUpMappingStringArgumentInfo,
    upperCaseFirst
} from '../../StepperComponent.utils';
import C from '../../../../App.constants';
import gqlQueries from '../CreateTypes.gql-queries';
import {
    sdlAddPropertyToType,
    sdlModifyFinderOfType,
    sdlRemoveFinderFromType,
    sdlRemovePropertyFromType,
    sdlUpdatePropertyOfType
} from '../../../../App.redux-actions';
import {sdlSelectProperty, sdlUpdateAddModifyPropertyDialog, sdlUpdateSelectedProperty} from '../../StepperComponent.redux-actions';
import PredefinedTypeSelector from './PredefinedTypeSelector/index';
import PropertySelector from './PropertySelector/index';

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

const ContentSwitch = ({mode, t, channel, updateSelectedProp, addPropertyAndClose, availableNodeTypes, selectedProperty, selectJCRProperty, nodeProperties, hasDuplicateName, cancelAndClose, selectChannel, removeAndClose, hasUserInputDetected, updateUserInputDetected}) => {
    if (channel === C.CHANNEL_PROPERTY) {
        return (
            <PropertyChannel t={t}
                             mode={mode}
                             updateSelectedProp={updateSelectedProp}
                             addPropertyAndClose={addPropertyAndClose}
                             selectedProperty={selectedProperty}
                             selectJCRProperty={selectJCRProperty}
                             nodeProperties={nodeProperties}
                             hasDuplicateName={hasDuplicateName}
                             cancelAndClose={cancelAndClose}
                             removeAndClose={removeAndClose}
                             updateUserInputDetected={updateUserInputDetected}/>
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
                                hasDuplicateName={hasDuplicateName}
                                cancelAndClose={cancelAndClose}
                                removeAndClose={removeAndClose}
                                hasUserInputDetected={hasUserInputDetected}
                                updateUserInputDetected={updateUserInputDetected}/>
        );
    }

    return (
        <ChannelSelect t={t}
                       selectChannel={selectChannel}
                       updateSelectedProp={updateSelectedProp}/>
    );
};

ContentSwitch.propTypes = {
    mode: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    channel: PropTypes.string,
    updateSelectedProp: PropTypes.func.isRequired,
    addPropertyAndClose: PropTypes.func.isRequired,
    availableNodeTypes: PropTypes.array.isRequired,
    selectedProperty: PropTypes.object,
    selectJCRProperty: PropTypes.func.isRequired,
    nodeProperties: PropTypes.array.isRequired,
    hasDuplicateName: PropTypes.bool.isRequired,
    cancelAndClose: PropTypes.func.isRequired,
    selectChannel: PropTypes.func.isRequired,
    removeAndClose: PropTypes.func.isRequired,
    hasUserInputDetected: PropTypes.bool.isRequired,
    updateUserInputDetected: PropTypes.func.isRequired
};

const AddModifyPropertyDialog = ({data, t, isOpen, closeDialog, mode, channel, availableNodeTypes, selection, selectedType, availableProperties, selectedProperty, addProperty, removeProperty, removeFinder, updateSelectedProp, updateProperty, selectChannel}) => {
    const nodes = _.isNil(data.jcr) ? [] : data.jcr.nodeTypes.nodes;
    let nodeProperties = nodes.length > 0 ? nodes[0].properties : [];

    const selectionId = _.isNil(selection) ? '' : selection;
    const selectedPropertyName = resolveSelectedProp(selectedProperty, 'propertyName');
    const oldPropertyName = resolveSelectedProp(selectedProperty, 'oldPropertyName');
    const selectedJcrPropertyName = resolveSelectedProp(selectedProperty, 'jcrPropertyName');
    const selectedPropertyType = resolveSelectedProp(selectedProperty, 'propertyType');
    const selectedIsPredefinedType = resolveSelectedProp(selectedProperty, 'isPredefinedType', false);

    const [userInputDetected, updateUserInputDetected] = useState(false);

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

        const isWeakreference = nodeProperties.find(p => p.name === jcrPropName && p.requiredType === 'WEAKREFERENCE') !== undefined;
        if (mode === C.DIALOG_MODE_EDIT) {
            updateProperty({
                name: selectedPropertyName,
                property: jcrPropName,
                isWeakreference: isWeakreference,
                type: propType
            }, selectionId, selectedProperty.propertyIndex, oldPropertyName, selection, selectedType);
        } else {
            addProperty({
                isWeakreference: isWeakreference,
                name: selectedPropertyName,
                property: jcrPropName,
                type: propType
            },
            selectionId);
        }

        updateUserInputDetected(false);
        closeDialog();
    };

    const removeAndClose = () => {
        removeProperty(selectedProperty.propertyIndex, selectionId);
        removeFinders();
        updateUserInputDetected(false);
        closeDialog();
    };

    const cancelAndClose = () => {
        updateUserInputDetected(false);
        closeDialog();
    };

    const removeFinders = () => {
        let suffix = generateFinderSuffix(selectedProperty.propertyName);
        let finders = selectedType.queries.filter(f => f.suffix === suffix.standard || f.suffix === suffix.connection);
        return finders.map(finder => removeFinder(selection, finder.name));
    };

    const selectJCRProperty = event => {
        const value = event.target.value;
        // If selected prop is 'NONE', unset the property
        if (!value) {
            updateSelectedProp({jcrPropertyName: ''});
            return;
        }

        let isList = false;
        const prop = nodeProperties.find(p => p.name === value || p.name + p.requiredType === value);
        if (value.startsWith(C.MULTIPLE_CHILDREN_INDICATOR)) {
            isList = true;
        } else {
            isList = prop.multiple === undefined ? false : prop.multiple;
        }

        let selectedProp = {
            jcrPropertyName: value,
            isListType: isList
        };

        // Preset custom property name
        if (mode === C.DIALOG_MODE_ADD && !userInputDetected && channel === 'PROPERTY') {
            selectedProp.propertyName = _.camelCase(removeNodeTypePrefix(prop.name));
        } else if (mode === C.DIALOG_MODE_ADD && !userInputDetected && channel === 'MAP_TO_TYPE' && value.indexOf('*') === -1) {
            // Preset only if the property is not a list of children nodes.
            selectedProp.propertyName = _.camelCase(removeNodeTypePrefix(prop.name));
        }

        updateSelectedProp(selectedProp);
    };

    return (
        <Dialog
            open={isOpen}
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
                hasDuplicateName={duplicateName}
                cancelAndClose={cancelAndClose}
                selectChannel={selectChannel}
                removeAndClose={removeAndClose}
                hasUserInputDetected={userInputDetected}
                updateUserInputDetected={updateUserInputDetected}
            />
        </Dialog>
    );
};

AddModifyPropertyDialog.propTypes = {
    data: PropTypes.object,
    t: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    name: PropTypes.string,
    channel: PropTypes.string,
    closeDialog: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired,
    updateSelectedProp: PropTypes.func.isRequired,
    removeFinder: PropTypes.func.isRequired,
    updateProperty: PropTypes.func.isRequired,
    selectChannel: PropTypes.func.isRequired,
    availableNodeTypes: PropTypes.array.isRequired,
    availableProperties: PropTypes.array.isRequired,
    selectedProperty: PropTypes.object,
    selectedType: PropTypes.object,
    requiredType: PropTypes.string,
    selection: PropTypes.string
};

const PropertyChannel = ({t, mode, updateSelectedProp, addPropertyAndClose, selectedProperty, cancelAndClose, selectJCRProperty, nodeProperties, hasDuplicateName, removeAndClose, updateUserInputDetected}) => {
    const selectedPropertyName = resolveSelectedProp(selectedProperty, 'propertyName');
    const selectedJcrPropertyName = resolveSelectedProp(selectedProperty, 'jcrPropertyName');

    const [showPropertySelector, setShowPropertySelector] = useState(false);
    return (
        <>
            <DialogTitle
                id="form-dialog-title"
            >{mode === C.DIALOG_MODE_EDIT ? t('label.sdlGeneratorTools.createTypes.viewProperty') : t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
            </DialogTitle>
            <DialogContent style={{width: 400}}>
                <PropertySelector required
                                  isOpen={showPropertySelector}
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
                    error={hasDuplicateName}
                    onKeyDown={e => {
                        // Delete key
                        if (e.which === 8 && selectedPropertyName.length > 0) {
                            updateUserInputDetected(true);
                        }
                    }}
                    onKeyPress={e => {
                        if (e.which !== 13) {
                            updateUserInputDetected(true);
                        }

                        if (e.key === 'Enter' && !hasDuplicateName && selectedPropertyName && selectedJcrPropertyName) {
                            addPropertyAndClose();
                        } else if (e.which === 32) {
                            e.preventDefault();
                            return false;
                        }
                    }}
                    onChange={e => updateSelectedProp({propertyName: e.target.value})}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="secondary"
                        onClick={cancelAndClose}
                >
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button disabled={hasDuplicateName || !selectedPropertyName || !selectedJcrPropertyName}
                        variant="primary"
                        size="normal"
                        onClick={addPropertyAndClose}
                >
                    {mode === C.DIALOG_MODE_ADD ? t('label.sdlGeneratorTools.addButton') : t('label.sdlGeneratorTools.updateButton')}
                </Button>
                {
                    mode === C.DIALOG_MODE_EDIT &&
                    <Button variant="secondary"
                            size="normal"
                            onClick={removeAndClose}
                    >
                        {t('label.sdlGeneratorTools.deleteButton')}
                    </Button>
                }
            </DialogActions>
        </>
    );
};

PropertyChannel.propTypes = {
    t: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    updateSelectedProp: PropTypes.func.isRequired,
    addPropertyAndClose: PropTypes.func.isRequired,
    selectedProperty: PropTypes.object,
    cancelAndClose: PropTypes.func.isRequired,
    selectJCRProperty: PropTypes.func.isRequired,
    nodeProperties: PropTypes.array.isRequired,
    hasDuplicateName: PropTypes.bool.isRequired,
    removeAndClose: PropTypes.func.isRequired,
    updateUserInputDetected: PropTypes.func.isRequired
};

const TypeMappingChannel = ({t, mode, updateSelectedProp, addPropertyAndClose, availableNodeTypes, selectedProperty, cancelAndClose, removeAndClose, selectJCRProperty, nodeProperties, hasDuplicateName, hasUserInputDetected, updateUserInputDetected}) => {
    const selectedPropertyName = resolveSelectedProp(selectedProperty, 'propertyName');
    const selectedJcrPropertyName = resolveSelectedProp(selectedProperty, 'jcrPropertyName');
    const selectedPropertyType = resolveSelectedProp(selectedProperty, 'propertyType');
    const selectedIsListType = resolveSelectedProp(selectedProperty, 'isListType', false);

    const [showPropertySelector, setShowPropertySelector] = useState(false);
    const [showPredefinedTypeSelector, setPredefinedTypeSelector] = useState(false);

    const filterProperties = prps => {
        return prps.filter(p => ['jnt:translation', 'jnt:conditionalVisibility'].indexOf(p.requiredType) === -1);
    };

    const properties = sortProperties(filterProperties(nodeProperties));

    const handlePredefinedTypeChange = event => {
        const prop = {
            propertyType: event.target.value
        };
        // Preset propertyName using predefinted type name IF:
        // A property is not already selected, or IF the selected property is a list of children(denoted by *)
        if (mode === C.DIALOG_MODE_ADD && !hasUserInputDetected && (!selectedJcrPropertyName || selectedJcrPropertyName.startsWith('*'))) {
            prop.propertyName = _.camelCase(event.target.value);
        }

        updateSelectedProp(prop);
    };

    return (
        <>
            <DialogTitle
                id="form-dialog-title"
            >{mode === C.DIALOG_MODE_EDIT ? t('label.sdlGeneratorTools.createTypes.viewProperty') : t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
            </DialogTitle>
            <DialogContent style={{width: 400}}>
                <PredefinedTypeSelector t={t}
                                        isOpen={showPredefinedTypeSelector}
                                        types={C.PREDEFINED_SDL_TYPES.concat(availableNodeTypes)}
                                        value={selectedPropertyType.replace(/(\[|])/g, '')}
                                        handleOpen={() => setPredefinedTypeSelector(true)}
                                        handleClose={() => setPredefinedTypeSelector(false)}
                                        handleChange={handlePredefinedTypeChange}/>
                <PropertySelector isOpen={showPropertySelector}
                                  required={false}
                                  t={t}
                                  nodeProperties={properties}
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
                    error={hasDuplicateName}
                    onKeyDown={e => {
                        // Delete key
                        if (e.which === 8 && selectedPropertyName.length > 0) {
                            updateUserInputDetected(true);
                        }
                    }}
                    onKeyPress={e => {
                        if (e.which !== 13) {
                            updateUserInputDetected(true);
                        }

                        if (e.key === 'Enter' && !hasDuplicateName && !selectedPropertyName && !selectedPropertyType) {
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
            </DialogContent>
            <DialogActions>
                <Button variant="secondary"
                        onClick={cancelAndClose}
                >
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button disabled={hasDuplicateName || !selectedPropertyName || !selectedPropertyType}
                        variant="primary"
                        size="normal"
                        onClick={addPropertyAndClose}
                >
                    {mode === C.DIALOG_MODE_ADD ? t('label.sdlGeneratorTools.addButton') : t('label.sdlGeneratorTools.updateButton')}
                </Button>
                {
                    mode === C.DIALOG_MODE_EDIT &&
                    <Button variant="secondary"
                            size="normal"
                            onClick={removeAndClose}
                    >

                        {t('label.sdlGeneratorTools.deleteButton')}

                    </Button>
                }
            </DialogActions>
        </>
    );
};

TypeMappingChannel.propTypes = {
    t: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    updateSelectedProp: PropTypes.func.isRequired,
    addPropertyAndClose: PropTypes.func.isRequired,
    selectedProperty: PropTypes.object.isRequired,
    cancelAndClose: PropTypes.func.isRequired,
    selectJCRProperty: PropTypes.func.isRequired,
    nodeProperties: PropTypes.array.isRequired,
    hasDuplicateName: PropTypes.bool.isRequired,
    hasUserInputDetected: PropTypes.bool.isRequired,
    removeAndClose: PropTypes.func.isRequired,
    updateUserInputDetected: PropTypes.func.isRequired,
    availableNodeTypes: PropTypes.array.isRequired
};

const ChannelSelect = ({t, selectChannel, updateSelectedProp}) => (
    <>
        <DialogContent style={{width: 400}}>
            <FormGroup>
                <Button variant="primary"
                        size="normal"
                        style={{marginBottom: 8}}
                        onClick={() => {
                            updateSelectedProp({isPredefinedType: true, jcrPropertyName: ''});
                            selectChannel('MAP_TO_TYPE');
                        }}
                >
                    {t('label.sdlGeneratorTools.createProperty.mapToType')}
                </Button>
                <Button variant="primary"
                        size="normal"
                        style={{marginBottom: 24}}
                        onClick={() => selectChannel('PROPERTY')}
                >
                    {t('label.sdlGeneratorTools.createProperty.selectProp')}
                </Button>
            </FormGroup>
        </DialogContent>
    </>
);

ChannelSelect.propTypes = {
    t: PropTypes.func.isRequired,
    updateSelectedProp: PropTypes.func.isRequired,
    selectChannel: PropTypes.func.isRequired
};

const getJCRType = (nodeTypes, selection) => {
    if (nodeTypes && selection) {
        const node = nodeTypes[selection];
        return lookUpMappingStringArgumentInfo(node, 'node');
    }

    return '';
};

const mapStateToProps = ({sdlGeneratorTools: state}) => {
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
        // eslint-disable-next-line max-params
        updateProperty: (propertyInfo, typeIndex, propIndex, oldPropertyName, selection, selectedType) => {
            dispatch(sdlUpdatePropertyOfType(propertyInfo, typeIndex, propIndex));
            ['', 'Connection'].forEach(finder => {
                const suffix = 'by' + upperCaseFirst(oldPropertyName) + finder;
                const index = _.isNil(selectedType.queries) ? -1 : selectedType.queries.findIndex(query => query.suffix === suffix);
                if (index !== -1) {
                    const finderInfo = selectedType.queries[index];
                    const finderPrefix = finderInfo.prefix;
                    const finderSuffix = 'by' + upperCaseFirst(propertyInfo.name) + finder;
                    dispatch(sdlModifyFinderOfType(selection, index, {
                        name: formatFinderName(finderPrefix, finderSuffix),
                        prefix: finderPrefix,
                        suffix: finderSuffix
                    }));
                }
            });
        },
        updateSelectedProp: propertyFields => dispatch(sdlUpdateSelectedProperty(propertyFields)),
        removeProperty: (propertyIndex, typeIndexOrName) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndexOrName)),
        removeFinder: (uuid, finderIndex) => dispatch(sdlRemoveFinderFromType(uuid, finderIndex)),
        closeDialog: () => {
            dispatch(sdlUpdateAddModifyPropertyDialog({isOpen: false, mode: C.DIALOG_MODE_ADD}));
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
    withTranslation('sdl-generator-tools')
)(AddModifyPropertyDialog);

export default withApollo(CompositeComp);
