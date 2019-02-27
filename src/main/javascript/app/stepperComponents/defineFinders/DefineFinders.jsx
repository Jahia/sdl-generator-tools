import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Grid, Paper, List, ListItem, ListItemText, ListSubheader, ListItemSecondaryAction, Button, IconButton} from '@material-ui/core';
import {Delete, Edit} from '@material-ui/icons';
import {Add} from '@material-ui/icons';
import AddModifyFinderDialog from './addModifyFinderDialog';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {upperCaseFirst} from '../../util/helperFunctions';
import C from '../../App.constants';

const styles = theme => ({
    paper: {
        width: 360,
        height: 400
    },
    finderItem: {
        flex: 2
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
                <Grid item>
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
                <Grid item>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.defineFinder.finders')}</ListSubheader>}>
                            <Button disabled={selectedType === null || availableFinders.length === 0}
                                    onClick={() => updateDialogState(Object.assign({}, dialogState, {open: true, mode: C.DIALOG_MODE_ADD}))}
                            >
                                {t('label.sdlGeneratorTools.defineFinder.addAFinderCaption')}
                                <Add/>
                            </Button>
                            {
                                nodeTypes.filter(type => type.name === selection).map(type => type.queries.map((finder, idx) => {
                                        return (
                                            <List dense={false}>
                                                <FinderItem key={idx}
                                                            handleEditFinder={handleEditFinder}
                                                            removeFinder={() => removeFinder(selectedType.idx, idx)}
                                                            name={finder.name}/>
                                            </List>
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
                                   selectedType={selectedType}
                                   selectedFinder={getSelectedFinder()}
                                   availableFinders={availableFinders}
                                   selection={selection}/>
        </React.Fragment>
    );

    function filterAvailableFinders(selectedType) {
        let finders = [];
        let editingFinder = getSelectedFinder();
        if (editingFinder && editingFinder.suffix === 'all') {
            finders.push('all');
        } else if (selectedType.queries.reduce((acc, curr) => curr.suffix === 'all' ? false : acc, true)) {
            finders.push('all');
        }
        return selectedType.fieldDefinitions.reduce((acc, curr) => {
            let finder = `by${upperCaseFirst(curr.name)}`;
            let connectionVariant = `${finder}Connection`;
            let connectionVariantExists = false;
            if (editingFinder && editingFinder.suffix === finder) {
                // If dialog mode is DIALOG_MODE_EDIT and the selected finder is this one
                // Then add it to the list
                acc.push(finder);
            } else if (editingFinder && editingFinder.suffix === connectionVariant) {
                // If dialog mode is DIALOG_MODE_EDIT and the selected finder is this one
                // Then add it to the list
                acc.push(connectionVariant);
            }
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

const FinderItem = withStyles(styles)(({classes, name, handleEditFinder, idx, removeFinder}) => (
    <ListItem classes={{root: classes.finderItem}}>
        <ListItemText primary={name}/>
        <ListItemSecondaryAction>
            <IconButton onClick={() => handleEditFinder(name)}>
                <Edit/>
            </IconButton>
            <IconButton onClick={e => removeFinder(idx)}>
                <Delete/>
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
