import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {compose, withApollo, graphql} from 'react-apollo';
import gqlQueries from '../CreateTypes.gql-queries';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {
    FormControlLabel,
    FormGroup,
    Switch,
    withStyles
} from '@material-ui/core';
import {Typography, Button} from '@jahia/ds-mui-theme';
import * as _ from 'lodash';
import C from '../../../App.constants';
import {
    sdlAddType, sdlUpdateType,
    sdlAddDirectiveArgToType,
    sdlRemoveDirectiveArgFromType, sdlRemoveType
} from '../../../App.redux-actions';
import {
    sdlSelectType,
    sdlUpdateAddModifyTypeDialog
} from '../../StepperComponent.redux-actions';
import {
    lookUpMappingStringArgumentInfo,
    lookUpMappingBooleanArgumentInfo,
    lookUpMappingArgumentIndex,
    getAvailableTypeNames,
    upperCaseFirst
} from '../../StepperComponent.utils';
import {connect} from 'react-redux';
import {generateUUID} from '../../../App.utils';
import TypeSelect from './TypeSelect';

const styles = () => ({
    paper: {
        overflow: 'visible'
    }
});

const AddTypeDialog = ({classes, defaultNodeTypeNames, allNodeTypeNames, t, open, closeDialog, mode, selection, selectedType, selectType, removeType, addType, updateType, addDirective, removeDirective, availableTypeNames}) => {
    const customTypeName = !_.isNil(selectedType) ? selectedType.name : '';
    const customDisplayName = !_.isNil(selectedType) ? selectedType.displayName : '';
    const jcrNodeType = lookUpMappingStringArgumentInfo(selectedType, 'node');
    const ignoreDefaultQueriesDirective = lookUpMappingBooleanArgumentInfo(selectedType, 'ignoreDefaultQueries');
    const [typeName, updateTypeName] = useState(customTypeName);
    const [displayName, updateDisplayName] = useState(customDisplayName);
    const [nodeType, updateNodeType] = useState(jcrNodeType);
    const [ignoreDefaultQueries, updateIgnoreDefaultQueries] = useState(ignoreDefaultQueriesDirective);
    const [userInputDetected, updateUserInputDetected] = useState(false);

    const cleanUp = () => {
        updateTypeName(null);
        updateNodeType(null);
        updateIgnoreDefaultQueries(false);
        updateUserInputDetected(false);
    };

    const duplicateName = (mode === C.DIALOG_MODE_EDIT && typeName === customTypeName) ? false : availableTypeNames.indexOf(typeName) !== -1;

    const saveTypeAndClose = () => {
        let uuid = selection;

        if (mode === C.DIALOG_MODE_ADD) {
            uuid = generateUUID();
            addType({typeName: typeName, displayName: displayName, nodeType: nodeType}, uuid);
            selectType(uuid);
        } else {
            updateType({typeName: typeName, displayName: displayName, nodeType: nodeType}, uuid);
        }

        if (ignoreDefaultQueries) {
            addDirective(uuid, 'mapping', {
                value: ignoreDefaultQueries,
                name: 'ignoreDefaultQueries'
            });
        } else if (mode === C.DIALOG_MODE_EDIT) {
            removeDirective(uuid, 'mapping', lookUpMappingArgumentIndex(selectedType, 'ignoreDefaultQueries'));
        }
        closeDialog();
        cleanUp();
    };

    const cancelAndClose = () => {
        closeDialog();
        cleanUp();
    };

    const removeAndClose = () => {
        removeType(selection);
        closeDialog();
        cleanUp();
    };

    const openDialog = (mode, typeName, nodeType, ignoreDefaultQueries) => {
        if (mode === C.DIALOG_MODE_EDIT) {
            updateTypeName(typeName);
            updateNodeType(nodeType);
            updateIgnoreDefaultQueries(ignoreDefaultQueries);
        } else {
            cleanUp();
        }
    };

    const handleCustomTypeKeyPress = event => {
        // Enter
        if (event.which !== 13) {
            updateUserInputDetected(true);
        }
        if (event.key === 'Enter' && !duplicateName && nodeType && typeName) {
            saveTypeAndClose();
        } else if (event.which === 32) {
            event.preventDefault();
            return false;
        }
    };

    return (
        <Dialog open={open}
                classes={classes}
                aria-labelledby="form-dialog-title"
                onClose={closeDialog}
                onEnter={() => {
                    openDialog(mode, customTypeName, jcrNodeType, ignoreDefaultQueriesDirective);
                }}
        >
            <DialogTitle
                id="form-dialog-title"
            >{mode === C.DIALOG_MODE_EDIT ? t('label.sdlGeneratorTools.createTypes.editTypeButton') : t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}
            </DialogTitle>
            <DialogContent style={{width: 400, overflow: 'visible'}}>
                <TypeSelect t={t}
                            value={mode === C.DIALOG_MODE_EDIT ? {label: customDisplayName, value: jcrNodeType} : null}
                            defaultNodes={!_.isNil(defaultNodeTypeNames) ? defaultNodeTypeNames.nodeTypes.nodes : null}
                            allNodes={!_.isNil(allNodeTypeNames) ? allNodeTypeNames.nodeTypes.nodes : null}
                            handleChange={event => {
                                updateNodeType(event.value);
                                updateDisplayName(event.label);
                                if (mode === C.DIALOG_MODE_ADD && !userInputDetected) {
                                    updateTypeName(upperCaseFirst(_.camelCase(event.label)));
                                }
                            }}
                />
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="typeName"
                    label={
                        <Typography color="alpha" variant="zeta">
                            {t('label.sdlGeneratorTools.createTypes.customTypeNameText')}
                        </Typography>
                    }
                    type="text"
                    value={!_.isNil(typeName) ? typeName : ''}
                    error={duplicateName}
                    onKeyDown={e => {
                        // Delete key
                        if (e.which === 8 && typeName && typeName.length > 0) {
                            updateUserInputDetected(true);
                        }
                    }}
                    onKeyPress={handleCustomTypeKeyPress}
                    onChange={e => updateTypeName(e.target.value)}
                />
                <FormGroup row>
                    <FormControlLabel
                        label={
                            <Typography color="alpha" variant="zeta">
                                {t('label.sdlGeneratorTools.createTypes.ignoreDefaultQueries', {type: typeName ? _.lowerFirst(typeName) : ''})}
                            </Typography>
                        }
                        control={
                            <Switch
                                color="primary"
                                checked={ignoreDefaultQueries}
                                onChange={e => updateIgnoreDefaultQueries(e.target.checked)}
                            />
                        }/>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button variant="ghost"
                        size="normal"
                        onClick={cancelAndClose}
                >
                        {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button variant="primary"
                        size="normal"
                        disabled={duplicateName || !nodeType || !typeName}
                        onClick={saveTypeAndClose}
                >
                        {mode === C.DIALOG_MODE_ADD ? t('label.sdlGeneratorTools.addButton') : t('label.sdlGeneratorTools.updateButton')}
                </Button>
                {
                    mode === C.DIALOG_MODE_EDIT &&
                    <Button variant="secondary" size="normal" onClick={removeAndClose}>
                            {t('label.sdlGeneratorTools.deleteButton')}
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
};

AddTypeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
    removeType: PropTypes.func.isRequired,
    selectType: PropTypes.func.isRequired,
    addType: PropTypes.func.isRequired,
    availableTypeNames: PropTypes.array.isRequired,
    removeDirective: PropTypes.func.isRequired,
    addDirective: PropTypes.func.isRequired

};

const mapStateToProps = state => {
    return {
        availableTypeNames: getAvailableTypeNames(state.nodeTypes, null),
        selectedType: state.nodeTypes[state.selection],
        selection: state.selection,
        ...state.addModifyTypeDialog
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeType: typeName => dispatch(sdlRemoveType(typeName)),
        selectType: selection => dispatch(sdlSelectType(selection)),
        addType: (infos, uuid) => dispatch(sdlAddType(infos, uuid)),
        updateType: (infos, uuid) => dispatch(sdlUpdateType(infos, uuid)),
        removeDirective: (type, directiveName, args) => dispatch(sdlRemoveDirectiveArgFromType(type, directiveName, args)),
        addDirective: (type, directiveName, args) => dispatch(sdlAddDirectiveArgToType(type, directiveName, args)),
        closeDialog: () => dispatch(sdlUpdateAddModifyTypeDialog({open: false}))
    };
};

const CompositeComp = compose(
    connect(mapStateToProps, mapDispatchToProps),
    graphql(gqlQueries.DEFAULT_NODE_TYPE_NAMES, {
        options() {
            return {
                variables: {},
                fetchPolicy: 'cache-first'
            };
        },
        props: ({data: {jcr}}) => ({
            defaultNodeTypeNames: jcr
        })
    }),
    graphql(gqlQueries.ALL_NODE_TYPE_NAMES, {
        options() {
            return {
                variables: {},
                fetchPolicy: 'cache-first'
            };
        },
        props: ({data: {jcr}}) => ({
            allNodeTypeNames: jcr
        })
    }),
    withStyles(styles),
    translate()
)(AddTypeDialog);

export default withApollo(CompositeComp);

