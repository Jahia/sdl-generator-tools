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
    Button,
    FormControlLabel,
    FormGroup,
    Switch,
    withStyles
} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import * as _ from 'lodash';
import C from '../../../App.constants';
import {
    sdlAddType,
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
    getAvailableTypeNames
} from '../../StepperComponent.utils';
import {Close} from '@material-ui/icons';
import connect from 'react-redux/es/connect/connect';
import {generateUUID} from '../../../App.utils';
import TypeSelect from './TypeSelect';

const styles = () => ({
    paper: {
        overflow: 'visible'
    }
});

const AddTypeDialog = ({classes, data, t, open, closeDialog, mode, selection, selectedType, selectType, removeType, addType, addDirective, removeDirective, availableTypeNames}) => {
    const customTypeName = !_.isNil(selectedType) ? selectedType.name : '';
    const customDisplayName = !_.isNil(selectedType) ? selectedType.displayName : '';
    const jcrNodeType = lookUpMappingStringArgumentInfo(selectedType, 'node');
    const ignoreDefaultQueriesDirective = lookUpMappingBooleanArgumentInfo(selectedType, 'ignoreDefaultQueries');
    const [typeName, updateTypeName] = useState(customTypeName);
    const [displayName, updateDisplayName] = useState(customDisplayName);
    const [nodeType, updateNodeType] = useState(jcrNodeType);
    const [ignoreDefaultQueries, updateIgnoreDefaultQueries] = useState(ignoreDefaultQueriesDirective);
    const jcrNodeTypes = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : null;

    const cleanUp = () => {
        updateTypeName(null);
        updateNodeType(null);
        updateIgnoreDefaultQueries(false);
    };

    const duplicateName = availableTypeNames.indexOf(typeName) !== -1;

    const saveTypeAndClose = () => {
        let uuid = selection;

        if (mode === C.DIALOG_MODE_ADD) {
            uuid = generateUUID();
            addType({typeName: typeName, displayName: displayName, nodeType: nodeType}, uuid);
            selectType(uuid);
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
                <TypeSelect disabled={mode === C.DIALOG_MODE_EDIT}
                            t={t}
                            value={mode === C.DIALOG_MODE_EDIT ? {label: customDisplayName, value: jcrNodeType} : null}
                            jcrNodeTypes={jcrNodeTypes}
                            handleChange={event => {
                                updateNodeType(event.value);
                                updateDisplayName(event.label);
                            }}
                />
                <TextField
                    autoFocus
                    fullWidth
                    disabled={mode === C.DIALOG_MODE_EDIT}
                    margin="dense"
                    id="typeName"
                    label={
                        <Typography color="alpha" variant="zeta">
                            {t('label.sdlGeneratorTools.createTypes.customTypeNameText')}
                        </Typography>
                    }
                    type="text"
                    value={!_.isNil(typeName) ? typeName : ''}
                    error={mode === C.DIALOG_MODE_ADD ? duplicateName : false}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            saveTypeAndClose();
                        } else if (e.which === 32) {
                            e.preventDefault();
                            return false;
                        }
                    }}
                    onChange={e => updateTypeName(e.target.value)}
                />
                <FormGroup row>
                    <FormControlLabel
                        label={
                            <Typography color="alpha" variant="zeta">
                                {t('label.sdlGeneratorTools.createTypes.ignoreDefaultQueries')}
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
                <Button color="primary"
                        disabled={mode === C.DIALOG_MODE_ADD ? duplicateName : false}
                        onClick={saveTypeAndClose}
                >
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.saveButton')}
                    </Typography>
                </Button>
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
        removeDirective: (type, directiveName, args) => dispatch(sdlRemoveDirectiveArgFromType(type, directiveName, args)),
        addDirective: (type, directiveName, args) => dispatch(sdlAddDirectiveArgToType(type, directiveName, args)),
        closeDialog: () => dispatch(sdlUpdateAddModifyTypeDialog({open: false}))
    };
};

const CompositeComp = compose(
    connect(mapStateToProps, mapDispatchToProps),
    graphql(gqlQueries.NODE_TYPE_NAMES, {
        options() {
            return {
                variables: {},
                fetchPolicy: 'cache-first'
            };
        }
    }),
    withStyles(styles),
    translate()
)(AddTypeDialog);

export default withApollo(CompositeComp);

