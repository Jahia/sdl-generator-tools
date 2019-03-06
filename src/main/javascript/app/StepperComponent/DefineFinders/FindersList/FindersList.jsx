import React from 'react';
import {Button, List, ListItem, ListItemText, ListSubheader, Paper, withStyles} from '@material-ui/core';
import C from '../../../App.constants';
import {Add} from '@material-ui/icons';
import {
    sdlSelectFinder,
    sdlUpdateAddModifyFinderDialog
} from '../../StepperComponent.redux-actions';
import {compose} from 'react-apollo';
import connect from 'react-redux/es/connect/connect';
import {translate} from 'react-i18next';

const styles = () => ({
    paper: {
        width: '100%',
        minHeight: '60%',
        maxHeight: '60%',
        padding: '6px 0px',
        overflowY: 'auto'
    }
});

const FinderItem = ({name, handleEditFinder}) => (
    <ListItem button onClick={() => handleEditFinder(name)}>
        <ListItemText primary={name}/>
    </ListItem>
);

const FindersList = ({t, classes, selectedType, availableFinders, selectFinder, updateFinderDialogState}) => {
    const handleEditFinder = finderName => {
        updateFinderDialogState({open: true, mode: C.DIALOG_MODE_EDIT});
        selectFinder(finderName);
    };
    return (
        <Paper className={classes.paper}>
            <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.defineFinder.finders')}</ListSubheader>}>
                <ListItem>
                    <Button disabled={selectedType === undefined || availableFinders.length === 0}
                            onClick={() => updateFinderDialogState(Object.assign({}, {open: true, mode: C.DIALOG_MODE_ADD}))}
                    >
                        {t('label.sdlGeneratorTools.defineFinder.addAFinder')}
                        <Add/>
                    </Button>
                </ListItem>
                {
                    selectedType && selectedType.queries.map(finder => {
                        return (
                            <FinderItem key={finder.name}
                                        handleEditFinder={handleEditFinder}
                                        name={finder.name}
                            />
                        );
                    })
                }
            </List>
        </Paper>
    );
};

const mapStateToProps = state => {
    return {
        selectedType: state.nodeTypes[state.selection]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateFinderDialogState: state => dispatch(sdlUpdateAddModifyFinderDialog(state)),
        selectFinder: finderName => dispatch(sdlSelectFinder(finderName))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
    translate()
)(FindersList);
