import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Select, MenuItem, Dialog, withStyles, InputLabel, FormControl, Input} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {translate} from 'react-i18next';
import {upperCaseFirst} from '../../StepperComponent.utils';
import C from '../../../App.constants';
import * as _ from 'lodash';
import {Close} from '@material-ui/icons';

const FinderSelectCom = ({classes, t, open, handleClose, handleOpen, handleChange, value, values}) => (
    <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="finder-name">{t('label.sdlGeneratorTools.defineFinder.selectAFinder')}</InputLabel>
        <Select open={open}
                value={value}
                input={<Input id="finder-name"/>}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
        >
            {
                values.map(finder => <MenuItem key={finder} value={finder} classes={classes}>{finder}</MenuItem>)
            }
        </Select>
    </FormControl>
);

const FinderSelect = withStyles({
    root: {
        padding: '15px 12px'
    },
    formControl: {
        margin: '0px 0px',
        width: '100%'
    }
})(FinderSelectCom);

const AddModifyFinderDialog = ({t, open, close, mode, addOrModifyFinder, removeFinder, selectedFinder, selectedType, availableFinders}) => {
    const currentFinder = !_.isNil(selectedType) ? selectedType.queries.filter(query => query.name === selectedFinder)[0] : null;
    const currentFinderPrefix = !_.isNil(currentFinder) ? currentFinder.prefix : '';
    const currentFinderSuffix = !_.isNil(currentFinder) ? currentFinder.suffix : '';
    const [finderPrefix, updateFinderPrefix] = useState(currentFinderPrefix);
    const [finderSuffix, updateFinderSuffix] = useState(currentFinderSuffix);
    const [showFinderSelector, setFinderSelectorStatus] = useState(false);

    const cleanUp = () => {
        updateFinderPrefix(null);
        updateFinderSuffix(null);
    };

    const addFinderAndClose = () => {
        if (_.isNil(finderPrefix) || _.isEmpty(finderPrefix) || _.isNil(finderSuffix) || _.isEmpty(finderSuffix)) {
            return;
        }
        addOrModifyFinder({name: formatName(), prefix: finderPrefix, suffix: finderSuffix});
        close();
        cleanUp();
        function formatName() {
            switch (finderSuffix) {
                case 'all':
                    return finderSuffix + upperCaseFirst(finderPrefix);
                case 'allConnection':
                    return 'all' + upperCaseFirst(finderPrefix) + 'Connection';
                default:
                    return finderPrefix + upperCaseFirst(finderSuffix);
            }
        }
    };

    const removeAndClose = () => {
        removeFinder(selectedType.name, currentFinder.name);
        close();
        cleanUp();
    };

    const cancelAndClose = () => {
        close();
        cleanUp();
    };

    const openDialog = (mode, finderPrefix, finderSuffix) => {
        if (mode === C.DIALOG_MODE_EDIT) {
            updateFinderPrefix(finderPrefix);
            updateFinderSuffix(finderSuffix);
        }
    };

    return (
        <Dialog open={open}
                aria-labelledby="form-dialog-title"
                onEnter={() => {
                    openDialog(mode, currentFinderPrefix, currentFinderSuffix);
                }}
        >
            <DialogTitle id="form-dialog-title">{t(mode === C.DIALOG_MODE_ADD ? 'label.sdlGeneratorTools.defineFinder.addAFinder' :
                'label.sdlGeneratorTools.defineFinder.editAFinder')}
            </DialogTitle>
            <DialogContent style={{width: 400}}>
                <FinderSelect open={showFinderSelector}
                              t={t}
                              values={availableFinders}
                              value={finderSuffix}
                              handleOpen={() => setFinderSelectorStatus(true)}
                              handleClose={() => setFinderSelectorStatus(false)}
                              handleChange={e => updateFinderSuffix(e.target.value)}/>
                <TextField autoFocus
                           fullWidth
                           margin="dense"
                           id="propertyName"
                           InputLabelProps={{
                               shrink: true
                           }}
                           label={t('label.sdlGeneratorTools.defineFinder.customFinderPrefixText')}
                           type="text"
                           value={finderPrefix}
                           onKeyPress={e => {
                               if (e.key === 'Enter') {
                                   addFinderAndClose();
                               } else if (e.which === 32) {
                                   e.preventDefault();
                                   return false;
                               }
                           }}
                           onChange={e => updateFinderPrefix(e.target.value)}
                />
                <Button disabled={mode === C.DIALOG_MODE_ADD} color="primary" onClick={removeAndClose}>
                    {t('label.sdlGeneratorTools.deleteButton')}
                    <Close/>
                </Button>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={cancelAndClose}>
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button color="primary"
                        onClick={addFinderAndClose}
                >
                    {t('label.sdlGeneratorTools.saveButton')}
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

export default translate()(AddModifyFinderDialog);
