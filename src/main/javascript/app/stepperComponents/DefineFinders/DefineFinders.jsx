import React, {useState} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {withStyles, Grid, Paper, List, ListItem, ListItemText, ListSubheader, ListItemSecondaryAction, Button, IconButton} from '@material-ui/core';
import {Edit} from '@material-ui/icons';
import {Add} from '@material-ui/icons';
import AddModifyFinderDialog from './addModifyFinderDialog';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {upperCaseFirst} from '../StepperComponent.utils';
import C from '../../App.constants';

const styles = theme => ({
    paper: {
        width: '100%',
        minHeight: '50%',
        padding: '6px 0px'
    },
    root: {
        position: 'absolute',
        textAlign: 'right'
    }
});

const DefineFinders = ({classes, t, addFinder, modifyFinder, removeFinder, nodeTypes, selection, selectType, selectedFinder, selectFinder}) => {
    const [dialogState, updateDialogState] = useState({open: false, mode: C.DIALOG_MODE_ADD});
    const selectedType = nodeTypes.reduce((acc, type, idx) => type.name === selection ? Object.assign({idx: idx}, type) : acc, null);
    const availableFinders = selectedType ? filterAvailableFinders(selectedType) : [];

    function handleEditFinder(finderName) {
        updateDialogState(Object.assign({}, dialogState, {open: true, mode: C.DIALOG_MODE_EDIT}));
        selectFinder(finderName);
    }

    function addOrModifyFinder(finderInfo) {
        if (dialogState.mode === C.DIALOG_MODE_ADD) {
            addFinder(selection, finderInfo);
        } else {
            let finderIndex = selectedType.queries.reduce((acc, curr, idx) => curr.name === selectedFinder ? idx : acc, null);
            modifyFinder(selection, finderIndex, finderInfo);
        }
    }

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.Type')}</ListSubheader>}>
                            {
                                nodeTypes.map(type => (
                                    <TypeItem key={type.name}
                                              {...type}
                                              isSelected={type.name === selection}
                                              selectType={selectType}/>
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.defineFinder.finders')}</ListSubheader>}>
                            <ListItem>
                                <Button disabled={selectedType === null || availableFinders.length === 0}
                                        onClick={() => updateDialogState(Object.assign({}, dialogState, {open: true, mode: C.DIALOG_MODE_ADD}))}
                                >
                                    {t('label.sdlGeneratorTools.defineFinder.addAFinder')}
                                    <Add/>
                                </Button>
                            </ListItem>
                            {
                                nodeTypes.filter(type => type.name === selection).map(type => type.queries.map((finder, idx) => {
                                        return (
                                            <FinderItem key={finder.name}
                                                        handleEditFinder={handleEditFinder}
                                                        removeFinder={() => removeFinder(selectedType.idx, idx)}
                                                        name={finder.name}
                                            />
                                        );
                                    }
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <AddModifyFinderDialog open={dialogState.open}
                                   close={() => updateDialogState(Object.assign({}, dialogState, {open: false}))}
                                   mode={dialogState.mode}
                                   addOrModifyFinder={addOrModifyFinder}
                                   removeFinder={removeFinder}
                                   selectedType={selectedType}
                                   selectedFinder={selectedFinder}
                                   availableFinders={availableFinders}
                                   selection={selection}/>
        </React.Fragment>
    );

    function filterAvailableFinders(selectedType) {
        let finders = ['all', 'allConnection'];
        // Check and filter out all/allConnection if it already is mapped to an existing finder
        finders = _.without(finders, ...selectedType.queries.filter(finder => finders.indexOf(finder.suffix) !== -1).map(finder => finder.suffix));
        // Add finders based on type properties, omit those that have already been created.
        finders = selectedType.fieldDefinitions.reduce((acc, curr) => {
            let finder = `by${upperCaseFirst(curr.name)}`;
            let connectionVariant = `${finder}Connection`;
            let connectionVariantExists = false;
            if (selectedType.queries.reduce((found, query) => {
                if (connectionVariant === query.suffix) {
                    connectionVariantExists = true;
                }
                return query.suffix === finder ? false : found;
            }, true)) {
                acc.push(finder);
            }
            if (!connectionVariantExists) {
                acc.push(connectionVariant);
            }
            return acc;
        }, finders);
        // If we are editing, add the suffix of the editing finder to the finders list and sort it.
        let editingFinder = getSelectedFinder();
        if (editingFinder) {
            finders.push(editingFinder.suffix);
            finders.sort();
        }
        return finders;
    }

    function getSelectedFinder() {
        if (dialogState.mode === C.DIALOG_MODE_EDIT) {
            return selectedType.queries.reduce((acc, curr) => curr.name === selectedFinder ? curr : acc, null);
        }
        return null;
    }
};

const TypeItem = ({name, isSelected, selectType}) => (
    <ListItem button
              selected={isSelected}
              onClick={() => selectType(name)}
    >
        <ListItemText primary={name}/>
    </ListItem>
);

const FinderItem = withStyles(styles)(({classes, name, handleEditFinder}) => (
    <ListItem button>
        <ListItemText primary={name}/>
        <ListItemSecondaryAction classes={classes}>
            <IconButton onClick={() => handleEditFinder(name)}>
                <Edit/>
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
));

DefineFinders.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    addFinder: PropTypes.func.isRequired,
    removeFinder: PropTypes.func.isRequired,
    selectType: PropTypes.func.isRequired,
    selection: PropTypes.string
};

export default compose(
    withStyles(styles),
    translate()
)(DefineFinders);
