import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {translate} from "react-i18next";
import {compose, withApollo, graphql} from "react-apollo";
import gqlQueries from "../../../gql/gqlQueries";
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {Button, MenuItem, Select} from '@material-ui/core';
import * as _ from 'lodash';

const NodeTypeSelect = ({value, open, handleClose, handleChange, handleOpen, nodeTypeNames}) => (
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
            !_.isNil(nodeTypeNames) ? nodeTypeNames.map( (galName, index) => {
                return <MenuItem key={index} value={galName.name}>{galName.name}</MenuItem>
            }) : ""
        }
    </Select>
);

const AddTypeDialog = ({data, t, open, closeDialog, customTypeName, jcrNodeType, addType}) => {
    const [typeName, updateTypeName] = useState(customTypeName);
    const [nodeType, updateNodeType] = useState(jcrNodeType);
    const [showNodeTypeSelector, setShowNodeTypeSelector] = useState(false);

    function addTypeAndClose() {
        addType({typeName: typeName, nodeType: nodeType});
        closeDialog();
    }

    return (
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
            onClose={closeDialog}
        >
            <DialogTitle id="form-dialog-title">{t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}</DialogTitle>
            <DialogContent style={{width: 400}}>
                <NodeTypeSelect open={showNodeTypeSelector}
                                value={nodeType}
                                nodeTypeNames={data.nodeTypeNames}
                                handleOpen={() => setShowNodeTypeSelector(true)}
                                handleClose={() => setShowNodeTypeSelector(false)}
                                handleChange={event => updateNodeType(event.target.value)}/>
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="typeName"
                    label={t('label.sdlGeneratorTools.createTypes.customTypeNameText')}
                    type="text"
                    value={typeName}
                    onChange={e => updateTypeName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={closeDialog}>
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button color="primary"
                        onClick={addTypeAndClose}
                >
                    {t('label.sdlGeneratorTools.addButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddTypeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    addType: PropTypes.func.isRequired,
    customTypeName: PropTypes.string,
    jcrNodeType: PropTypes.string
};

AddTypeDialog.defaultProps = {
    customTypeName: '',
    jcrNodeType: ''
};

const CompositeComp = graphql(gqlQueries.NODE_TYPE_NAMES, {
    options(props) {
        return {
            variables  : {
                namePrefix: ''
            },
            fetchPolicy: 'network-only'
        }
    }
})(AddTypeDialog);

const AddTypeDialogWithApolloComp = withApollo(CompositeComp);

export default translate()(AddTypeDialogWithApolloComp);
