import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Select, MenuItem, Dialog} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {translate} from 'react-i18next';
import {upperCaseFirst} from '../../../util/helperFunctions';

const FinderSelect = ({open, close, handleClose, handleOpen, handleChange, value, values}) => {
    return (
        <Select
        open={open}
        value={value}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={handleChange}
        >
            {
                values.map(finder => <MenuItem value={finder}>{finder}</MenuItem>)
            }
        </Select>
    );
};

const AddModifyFinderDialog = ({t, open, close, finderInfo, addFinder, selection, selectedType, availableFinders}) => {
    const [finderPrefix, updateFinderPrefix] = useState(finderInfo.prefix);
    const [finderSuffix, updateFinderSuffix] = useState(finderInfo.suffix);
    const [showFinderSelector, setFinderSelectorStatus] = useState(false);

    function addFinderAndClose() {
        let name = finderSuffix === 'all' ? finderSuffix + upperCaseFirst(finderPrefix) : finderPrefix + upperCaseFirst(finderSuffix);
        addFinder({name: name, prefix: finderPrefix, suffix: finderSuffix}, selection);
        close();
    }

    return (
        <Dialog
        open={open}
        aria-labelledby="form-dialog-title"
        close={close}
        >
            <DialogTitle id="form-dialog-title">{t('label.sdlGeneratorTools.defineFinder.addAFinderCaption')}</DialogTitle>
            <DialogContent style={{width: 400}}>
                <FinderSelect open={showFinderSelector}
                              values={availableFinders}
                              value={finderSuffix}
                              handleOpen={() => setFinderSelectorStatus(true)}
                              handleClose={() => setFinderSelectorStatus(false)}
                              handleChange={e => updateFinderSuffix(e.target.value)}/>
                <TextField
                autoFocus
                fullWidth
                margin="dense"
                id="propertyName"
                label={t('label.sdlGeneratorTools.defineFinder.customFinderPrefixText')}
                type="text"
                value={finderPrefix}
                onChange={e => updateFinderPrefix(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={close}>
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button color="primary"
                        onClick={addFinderAndClose}
                >
                    {t('label.sdlGeneratorTools.addButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddModifyFinderDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    selectedType: PropTypes.object.isRequired,
    availableFinders: PropTypes.array.isRequired
};

AddModifyFinderDialog.defaultProps = {
    finderInfo: {
        suffix: '',
        prefix: ''
    }
};

export default translate()(AddModifyFinderDialog);
