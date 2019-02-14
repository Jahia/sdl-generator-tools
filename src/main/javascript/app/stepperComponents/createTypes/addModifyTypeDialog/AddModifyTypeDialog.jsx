import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {Button, MenuItem, Select} from '@material-ui/core';

const NodeTypeSelect = ({value, open, handleClose, handleChange, handleOpen}) => (
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
        <MenuItem value="jnt:news">jnt:news</MenuItem>
        <MenuItem value="jnt:bigText">jnt:bigText</MenuItem>
    </Select>
);

const AddTypeDialog = ({open, closeDialog, customTypeName, jcrNodeType, addType}) => {
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
            <DialogTitle id="form-dialog-title">Add new type</DialogTitle>
            <DialogContent>
                <NodeTypeSelect open={showNodeTypeSelector}
                                value={nodeType}
                                handleOpen={() => setShowNodeTypeSelector(true)}
                                handleClose={() => setShowNodeTypeSelector(false)}
                                handleChange={event => updateNodeType(event.target.value)}/>
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="typeName"
                    label="Custom type name"
                    type="text"
                    value={typeName}
                    onChange={e => updateTypeName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={closeDialog}>
                    Cancel
                </Button>
                <Button color="primary"
                        onClick={addTypeAndClose}
                >
                    Add
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

export default AddTypeDialog;
