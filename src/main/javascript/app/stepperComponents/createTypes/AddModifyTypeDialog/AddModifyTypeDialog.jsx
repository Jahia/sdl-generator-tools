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
    withStyles
} from '@material-ui/core';
import * as _ from 'lodash';
import {sdlAddType, sdlEditType, sdlAddDirectiveArgToType} from '../../../App.redux-actions';
import {sdlSelectType} from '../../StepperComponent.redux-actions';
import {getNodeTypeInfo, getNodeTypeIgnoreDefaultQueries} from '../../../util/helperFunctions';

const dialogMode = {
    ADD: 'ADD',
    EDIT: 'EDIT'
};

const NodeTypeSelectCom = ({classes, value, open, handleClose, handleChange, handleOpen, nodeTypeNames}) => (
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
            !_.isNil(nodeTypeNames) ? nodeTypeNames.map(typeName => {
                return (
                    <MenuItem key={typeName.name} value={typeName.name} classes={classes}>
                        <ListItemText primary={typeName.displayName} secondary={typeName.name}/>
                    </MenuItem>
                );
            }) : null
        }
    </Select>
);

const NodeTypeSelect = withStyles({
    root: {
        padding: '15px 12px'
    }
})(NodeTypeSelectCom);

const AddTypeDialog = ({data, t, open, closeDialog, mode, dispatch, dispatchBatch, addType, selectedType, isDuplicatedTypeName}) => {
    const customTypeName = !_.isNil(selectedType) ? selectedType.name : '';
    const jcrNodeType = getNodeTypeInfo(selectedType);
    const ignoreDefaultQueriesDirective = getNodeTypeIgnoreDefaultQueries(selectedType);
    const [typeName, updateTypeName] = useState(customTypeName);
    const [nodeType, updateNodeType] = useState(jcrNodeType);
    const [showNodeTypeSelector, setShowNodeTypeSelector] = useState(false);
    const [ignoreDefaultQueries, updateIgnoreDefaultQueries] = useState(ignoreDefaultQueriesDirective);
    const nodeTypeNames = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : null;

    const cleanUp = () => {
        updateTypeName(null);
        updateNodeType(null);
        updateIgnoreDefaultQueries(false);
    };

    const saveTypeAndClose = () => {
        let actions;
        if (mode === dialogMode.ADD) {
            if (_.isNil(typeName) || _.isEmpty(typeName) || isDuplicatedTypeName(typeName) || _.isNil(nodeType) || _.isEmpty(nodeType)) {
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
                sdlEditType({typeName: typeName, nodeType: nodeType}),
                sdlSelectType(typeName)
            ];
        }

        if (ignoreDefaultQueries) {
            actions.push(sdlAddDirectiveArgToType(typeName, 'mapping', {value: ignoreDefaultQueries, name: 'ignoreDefaultQueries'}));
        }
        dispatchBatch(actions);
        closeDialog();
        cleanUp();
    };

    const cancelAndClose = () => {
        cleanUp();
        closeDialog();
    };

    const openDialog = (mode, typeName, nodeType, ignoreDefaultQueries) => {
        if (mode === dialogMode.EDIT) {
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
            <DialogTitle id="form-dialog-title">{mode === dialogMode.EDIT ? t('label.sdlGeneratorTools.createTypes.editTypeButton') : t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}</DialogTitle>
            <DialogContent style={{width: 400}}>
                <NodeTypeSelect open={showNodeTypeSelector}
                                value={nodeType}
                                nodeTypeNames={nodeTypeNames}
                                handleOpen={() => setShowNodeTypeSelector(true)}
                                handleClose={() => setShowNodeTypeSelector(false)}
                                handleChange={event => updateNodeType(event.target.value)}/>
                <TextField
                    autoFocus
                    fullWidth
                    disabled={mode === dialogMode.EDIT}
                    margin="dense"
                    id="typeName"
                    label={t('label.sdlGeneratorTools.createTypes.customTypeNameText')}
                    type="text"
                    value={typeName}
                    error={mode === dialogMode.ADD ? isDuplicatedTypeName(typeName) : false}
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
    closeDialog: PropTypes.func.isRequired,
    isDuplicatedTypeName: PropTypes.func.isRequired
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

export {
    dialogMode
};
