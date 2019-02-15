import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Grid, Paper, List, ListItem, ListItemText, ListSubheader, Button, Select, MenuItem, Dialog} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';

const FinderSelect = ({open, close, handleClose, handleOpen, handleChange, value}) => {
    return (
        <Select
        open={open}
        value={value}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={handleChange}
        >
            <MenuItem value="byPath">byPath</MenuItem>
            <MenuItem value="byId">byId</MenuItem>
            <MenuItem value="all">all</MenuItem>
        </Select>
    );
};

const AddModifyFinderDialog = ({open, close, finderInfo, addFinder, selection}) => {
    const [finderPrefix, updateFinderPrefix] = useState(finderInfo.prefix);
    const [finderSuffix, updateFinderSuffix] = useState(finderInfo.suffix);
    const [finderMultiple, updateFinderMultiple] = useState(finderInfo.multiple);
    const [showFinderSelector, setFinderSelectorStatus] = useState(false);

    function addFinderAndClose() {
        addFinder({prefix: finderPrefix, suffix: finderSuffix, multiple: finderMultiple}, selection);
        close();
    }

    return (
        <Dialog
        open={open}
        aria-labelledby="form-dialog-title"
        close={close}
        >
            <DialogTitle id="form-dialog-title">Add a finder</DialogTitle>
            <DialogContent>
                <FinderSelect open={showFinderSelector}
                              value={finderSuffix}
                              handleOpen={() => setFinderSelectorStatus(true)}
                              handleClose={() => setFinderSelectorStatus(false)}
                              handleChange={e => updateFinderSuffix(e.target.value)}/>
                <TextField
                autoFocus
                fullWidth
                margin="dense"
                id="propertyName"
                label="Custom finder prefix"
                type="text"
                value={finderPrefix}
                onChange={e => updateFinderPrefix(e.target.value)}
            />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={close}>
                Cancel
                </Button>
                <Button color="primary"
                        onClick={addFinderAndClose}
                >
                Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddModifyFinderDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

AddModifyFinderDialog.defaultProps = {
    finderInfo: {
        suffix: 'byPath',
        prefix: 'myCustom'
    }
};

export default AddModifyFinderDialog;