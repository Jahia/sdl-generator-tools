import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Select, MenuItem, Dialog, withStyles, InputLabel, FormControl, Input} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {translate} from 'react-i18next';
import {formatFinderName, upperCaseFirst} from '../../StepperComponent.utils';
import C from '../../../App.constants';
import * as _ from 'lodash';
import {Close} from '@material-ui/icons';
import {
    sdlAddFinderToType,
    sdlModifyFinderOfType,
    sdlRemoveFinderFromType
} from '../../../App.redux-actions';
import {Typography} from '@jahia/ds-mui-theme';
import {sdlUpdateAddModifyFinderDialog} from '../../StepperComponent.redux-actions';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {filterAvailableFinders} from '../DefineFinders.utils';

const FinderSelectCom = ({classes, t, open, handleClose, handleOpen, handleChange, value, values}) => {
    const renderFinder = val => {
        return val === 'all' || val === 'allConnection' ? `${val.substr(0, 3)}...${val.substr(3)}` : `...${val}`;
    };

    return (
        <FormControl classes={classes}>
            <InputLabel shrink htmlFor="finder-name">{
                <Typography color="alpha" variant="zeta">
                    {t('label.sdlGeneratorTools.defineFinder.selectAFinder')}
                </Typography>
        }
            </InputLabel>
            <Select open={open}
                    value={value}
                    input={<Input id="finder-name"/>}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    onChange={handleChange}
                    renderValue={renderFinder}
            >
                {
                values.map(finder => (
                    <MenuItem key={finder}
                              value={finder}
                              classes={{root: classes.menuItem}}
                    >{renderFinder(finder)}
                    </MenuItem>
                ))
            }
            </Select>
        </FormControl>
    );
};

const FinderSelect = withStyles({
    root: {
        margin: '0px 0px',
        width: '100%'
    },
    menuItem: {
        padding: '15px 12px'
    }
})(FinderSelectCom);

const FinderPreviewComp = ({classes, finderPrefix = '', finderSuffix = ''}) => {
    const format = () => {
        if (finderSuffix === 'all' || finderSuffix === 'allConnection') {
            return (
                <React.Fragment>
                    <span>{finderSuffix.substr(0, 3)}</span>
                    <em className={classes.prefix}>{upperCaseFirst(finderPrefix)}</em>
                    <span>{finderSuffix.substr(3)}</span>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <em className={classes.prefix}>{finderPrefix}</em>
                <span>{upperCaseFirst(finderSuffix)}</span>
            </React.Fragment>
        );
    };
    return (
        <p className={classes.finderPreview}>{format()}</p>
    );
};

const FinderPreview = withStyles(theme => ({
    finderPreview: {
        float: 'right'
    },
    prefix: {
        color: theme.palette.brand.alpha
    }
}))(FinderPreviewComp);

const AddModifyFinderDialog = ({t, open, close, mode, addFinder, modifyFinder, removeFinder, selectedType, selectedFinder, selection}) => {
    const currentFinder = selectedType ? selectedType.queries.find(query => query.name === selectedFinder) : undefined;
    const currentFinderPrefix = !_.isNil(currentFinder) ? currentFinder.prefix : '';
    const currentFinderSuffix = !_.isNil(currentFinder) ? currentFinder.suffix : '';
    const [finderPrefix, updateFinderPrefix] = useState(currentFinderPrefix);
    const [finderSuffix, updateFinderSuffix] = useState(currentFinderSuffix);
    const [showFinderSelector, setFinderSelectorStatus] = useState(false);
    const availableFinders = filterAvailableFinders(mode, selectedFinder, selectedType);
    const cleanUp = () => {
        updateFinderPrefix('');
        updateFinderSuffix('');
    };

    const addFinderAndClose = () => {
        if (_.isNil(finderPrefix) || _.isEmpty(finderPrefix) || _.isNil(finderSuffix) || _.isEmpty(finderSuffix)) {
            close();
            return;
        }
        addOrModifyFinder({name: formatFinderName(finderPrefix, finderSuffix), prefix: finderPrefix, suffix: finderSuffix});
        close();

        function addOrModifyFinder(finderInfo) {
            if (mode === C.DIALOG_MODE_ADD) {
                addFinder(selection, finderInfo);
            } else {
                let finderIndex = selectedType.queries.findIndex(finder => finder.name === selectedFinder);
                modifyFinder(selection, finderIndex, finderInfo);
            }
        }
    };

    const removeAndClose = () => {
        removeFinder(selection, currentFinder.name);
        close();
        cleanUp();
    };

    const cancelAndClose = () => {
        close();
        cleanUp();
    };

    const openDialog = () => {
        if (mode === C.DIALOG_MODE_EDIT) {
            updateFinderPrefix(currentFinderPrefix);
            updateFinderSuffix(currentFinderSuffix);
        }
    };

    return (
        <Dialog open={open}
                aria-labelledby="form-dialog-title"
                onEnter={openDialog}
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
                           label={
                               <Typography color="alpha" variant="zeta">
                                   {t('label.sdlGeneratorTools.defineFinder.customFinderPrefixText')}
                               </Typography>
                           }
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
                <FinderPreview finderPrefix={finderPrefix} finderSuffix={finderSuffix}/>
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
                <Button color="primary"
                        variant="contained"
                        onClick={cancelAndClose}
                >
                    <Typography color="inherit" variant="zeta">
                        {t('label.sdlGeneratorTools.cancelButton')}
                    </Typography>
                </Button>
                <Button color="primary"
                        variant="contained"
                        onClick={addFinderAndClose}
                >
                    <Typography color="inherit" variant="zeta">
                        {mode === C.DIALOG_MODE_ADD ? t('label.sdlGeneratorTools.addButton') : t('label.sdlGeneratorTools.updateButton')}
                    </Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddModifyFinderDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    selectedType: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        selectedType: state.nodeTypes[state.selection],
        selection: state.selection,
        selectedFinder: state.selectedFinder,
        ...state.addModifyFinderDialog
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addFinder: (uuid, finderInfo) => dispatch(sdlAddFinderToType(uuid, finderInfo)),
        modifyFinder: (uuid, finderIndex, finderInfo) => dispatch(sdlModifyFinderOfType(uuid, finderIndex, finderInfo)),
        removeFinder: (uuid, finderIndex) => dispatch(sdlRemoveFinderFromType(uuid, finderIndex)),
        close: () => dispatch(sdlUpdateAddModifyFinderDialog({open: false}))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate()
)(AddModifyFinderDialog);