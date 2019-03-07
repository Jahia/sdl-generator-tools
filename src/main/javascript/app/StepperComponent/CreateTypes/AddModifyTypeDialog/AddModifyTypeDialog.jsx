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
    MenuItem,
    Select,
    Switch,
    ListItemText,
    withStyles,
    FormControl,
    InputLabel,
    Input
} from '@material-ui/core';
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

const NodeTypeSelectCom = ({classes, t, disabled, value, open, handleClose, handleChange, handleOpen, jcrNodeTypes}) => (
    <FormControl classes={classes} disabled={disabled}>
        <InputLabel shrink htmlFor="type-name">{t('label.sdlGeneratorTools.createTypes.selectNodeType')}</InputLabel>
        <Select disabled={disabled}
                open={open}
                value={!_.isNil(value) ? value : ''}
                input={<Input id="type-name"/>}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {
                !_.isNil(jcrNodeTypes) ? jcrNodeTypes.map(typeName => (
                    <MenuItem key={typeName.name} value={typeName.name} classes={{root: classes.menuItem}}>
                        <ListItemText primary={typeName.displayName} secondary={typeName.name}/>
                    </MenuItem>
                )) : null
            }
        </Select>
    </FormControl>
);

const NodeTypeSelect = withStyles({
    root: {
        margin: '0px 0px',
        width: '100%'
    },
    menuItem: {
        padding: '15px 12px'
    }
})(NodeTypeSelectCom);

const AddTypeDialog = ({data, t, open, closeDialog, mode, selection, selectedType, selectType, removeType, addType, addDirective, removeDirective, availableTypeNames}) => {
    const customTypeName = !_.isNil(selectedType) ? selectedType.name : '';
    const jcrNodeType = lookUpMappingStringArgumentInfo(selectedType, 'node');
    const ignoreDefaultQueriesDirective = lookUpMappingBooleanArgumentInfo(selectedType, 'ignoreDefaultQueries');
    const [typeName, updateTypeName] = useState(customTypeName);
    const [nodeType, updateNodeType] = useState(jcrNodeType);
    const [showNodeTypeSelector, setShowNodeTypeSelector] = useState(false);
    const [ignoreDefaultQueries, updateIgnoreDefaultQueries] = useState(ignoreDefaultQueriesDirective);
    const jcrNodeTypes = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes.sort((a, b) => {
        a = a.displayName.toLowerCase();
        b = b.displayName.toLowerCase();
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }) : null;

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
            addType({typeName: typeName, nodeType: nodeType}, uuid);
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
        <Dialog
            open={open}
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
            <DialogContent style={{width: 400}}>
                <NodeTypeSelect open={showNodeTypeSelector}
                                disabled={mode === C.DIALOG_MODE_EDIT}
                                t={t}
                                value={nodeType}
                                jcrNodeTypes={jcrNodeTypes}
                                handleOpen={() => setShowNodeTypeSelector(true)}
                                handleClose={() => setShowNodeTypeSelector(false)}
                                handleChange={event => updateNodeType(event.target.value)}/>
                <TextField
                    autoFocus
                    fullWidth
                    disabled={mode === C.DIALOG_MODE_EDIT}
                    margin="dense"
                    id="typeName"
                    label={t('label.sdlGeneratorTools.createTypes.customTypeNameText')}
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
                        label={t('label.sdlGeneratorTools.createTypes.ignoreDefaultQueries')}
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
                        {t('label.sdlGeneratorTools.deleteButton')}
                        <Close/>
                    </Button>
                }
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={cancelAndClose}>
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button color="primary"
                        onClick={saveTypeAndClose}
                >
                    {t('label.sdlGeneratorTools.saveButton')}
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
    translate()
)(AddTypeDialog);

export default withApollo(CompositeComp);

