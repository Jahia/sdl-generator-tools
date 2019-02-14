import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Grid, Paper, List, ListItem, ListItemText, ListSubheader, Button, Select, MenuItem} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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

const AddTypeDialog = ({open, closeDialog, customTypeName = '', jcrNodeType = ''}) => {
    const [typeName, updateTypeName] = useState(customTypeName);
    const [nodeType, updateNodeType] = useState(jcrNodeType);
    const [showNodeTypeSelector, setShowNodeTypeSelector] = useState(false);

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
                <Button color="primary" onClick={closeDialog}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const TypeItem = ({name}) => (
    <ListItem>
        <ListItemText primary={name}/>
    </ListItem>
);

const CreateTypes = ({nodeTypes, addType}) => {
    const [addTypeDialogShown, showAddTypeDialog] = useState(false);

    return (
        <React.Fragment>
            <Grid container>
                <Grid item>
                    <Paper>
                        <List subheader={<ListSubheader>Node type</ListSubheader>}>
                            <Button onClick={() => showAddTypeDialog(true)}>
                                Add new type
                                <Add/>
                            </Button>
                            {
                                nodeTypes.map(type => (<TypeItem key={type.name} {...type}/>))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper>
                        <List subheader={<ListSubheader>Properties</ListSubheader>}>
                            <Button>
                                Add a new property
                                <Add/>
                            </Button>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <AddTypeDialog open={addTypeDialogShown} closeDialog={() => showAddTypeDialog(false)}/>
        </React.Fragment>
    );
};

CreateTypes.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    addType: PropTypes.func.isRequired,
    removeType: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired
};

export default CreateTypes;
