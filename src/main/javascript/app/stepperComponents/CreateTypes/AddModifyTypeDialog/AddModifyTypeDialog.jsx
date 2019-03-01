import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {compose, withApollo, graphql} from 'react-apollo';
import gqlQueries from '../../../gql/gqlQueries';
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
    InputLabel
} from '@material-ui/core';
import * as _ from 'lodash';
import C from '../../../App.constants';
import {
    sdlAddType,
    sdlAddDirectiveArgToType,
    sdlRemoveDirectiveArgFromType
} from '../../../App.redux-actions';
import {sdlSelectType} from '../../StepperComponent.redux-actions';
import {
    lookUpMappingStringArgumentInfo,
    lookUpMappingBooleanArgumentInfo,
    lookUpMappingArgumentIndex
} from '../../../util/helperFunctions';
import {Close} from '@material-ui/icons';

const NodeTypeSelectCom = ({classes, disabled, value, open, handleClose, handleChange, handleOpen, nodeTypeNames}) => (
    <FormControl className={classes.formControl} disabled={disabled}>
        <InputLabel shrink htmlFor="type-name">{"JCR node type"}</InputLabel>
        <Select disabled={disabled}
                open={open}
                value={!_.isNil(value) ? value : ''}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {
                !_.isNil(nodeTypeNames) ? nodeTypeNames.map(typeName => {
                    return (
                        <MenuItem key={typeName.name} value={typeName.name} classes={classes}>
                            <ListItemText primary={typeName.displayName} secondary={typeName.name}/>
                        </MenuItem>
                    );
                }) : null
            }
        </Select>
    </FormControl>
);

const NodeTypeSelect = withStyles({
    root: {
        padding: '15px 12px'
    },
    formControl: {
        margin: '0px 0px',
        width: '100%'
    }
})(NodeTypeSelectCom);

const AddTypeDialog = ({data, t, open, closeDialog, mode, dispatch, dispatchBatch, selectedType, isDuplicatedTypeName, removeType}) => {
    const customTypeName = !_.isNil(selectedType) ? selectedType.name : '';
    const jcrNodeType = lookUpMappingStringArgumentInfo(selectedType, 'node');
    const ignoreDefaultQueriesDirective = lookUpMappingBooleanArgumentInfo(selectedType, 'ignoreDefaultQueries');
    const [typeName, updateTypeName] = useState(customTypeName);
    const [nodeType, updateNodeType] = useState(jcrNodeType);
    const [showNodeTypeSelector, setShowNodeTypeSelector] = useState(false);
    const [ignoreDefaultQueries, updateIgnoreDefaultQueries] = useState(ignoreDefaultQueriesDirective);
    const nodeTypeNames = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes.sort((a, b) => {
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

    const duplicateName = isDuplicatedTypeName(typeName);

    const saveTypeAndClose = () => {
        let actions;
        if (mode === C.DIALOG_MODE_ADD) {
            if (_.isNil(typeName) || _.isEmpty(typeName) || _.isNil(nodeType) || _.isEmpty(nodeType)) {
                return;
            }
            actions = [
                sdlAddType({typeName: typeName, nodeType: nodeType}),
                sdlSelectType(typeName)
            ];
        } else {
            if (_.isNil(nodeType) || _.isEmpty(nodeType)) {
                return;
            }
            actions = [
                sdlSelectType(typeName)
            ];
        }

        if (ignoreDefaultQueries) {
            actions.push(sdlAddDirectiveArgToType(typeName, 'mapping', {
                value: ignoreDefaultQueries,
                name: 'ignoreDefaultQueries'
            }));
        } else if (mode === C.DIALOG_MODE_EDIT && !_.isNil(selectedType)) {
            actions.push(sdlRemoveDirectiveArgFromType(selectedType.idx, 'mapping', lookUpMappingArgumentIndex(selectedType, 'ignoreDefaultQueries')));
        }
        dispatchBatch(actions);
        closeDialog();
        cleanUp();
    };

    const cancelAndClose = () => {
        closeDialog();
        cleanUp();
    };

    const removeAndClose = () => {
        removeType(typeName);
        closeDialog();
        cleanUp();
    };

    const openDialog = (mode, typeName, nodeType, ignoreDefaultQueries) => {
        if (mode === C.DIALOG_MODE_EDIT) {
            updateTypeName(typeName);
            updateNodeType(nodeType);
            updateIgnoreDefaultQueries(ignoreDefaultQueries);
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
                                value={nodeType}
                                nodeTypeNames={nodeTypeNames}
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
                        disabled={duplicateName}
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
    closeDialog: PropTypes.func.isRequired,
    isDuplicatedTypeName: PropTypes.func.isRequired,
    removeType: PropTypes.func.isRequired
};

const CompositeComp = compose(
    graphql(gqlQueries.NODE_TYPE_NAMES, {
        options(props) {
            return {
                variables: {},
                fetchPolicy: 'network-only'
            };
        }
    }),
    translate()
)(AddTypeDialog);

export default withApollo(CompositeComp);

