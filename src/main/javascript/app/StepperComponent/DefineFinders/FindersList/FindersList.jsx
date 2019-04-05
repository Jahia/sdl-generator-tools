import React from 'react';
import {List, ListItem, ListItemText, ListSubheader, withStyles} from '@material-ui/core';
import C from '../../../App.constants';
import {Add} from '@material-ui/icons';
import {Typography, Paper, Button} from '@jahia/ds-mui-theme';
import {
    sdlSelectFinder,
    sdlUpdateAddModifyFinderDialog
} from '../../StepperComponent.redux-actions';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {filterAvailableFinders} from '../DefineFinders.utils';

const styles = theme => ({
    paper: {
        width: '100%',
        height: '100%',
        padding: 0,
        overflowY: 'auto',
        boxShadow: 'none',
        border: '1px solid ' + theme.palette.ui.omega
    },
    listButton: {
        '& > * *': {
            color: theme.palette.brand.alpha
        }
    },
    subHeader: {
        textDecoration: 'none',
        padding: (theme.spacing.unit * 3),
        background: theme.palette.ui.epsilon,
        borderBottom: '1px solid ' + theme.palette.ui.omega
    }
});

const FinderItem = ({name, handleEditFinder}) => (
    <ListItem button onClick={() => handleEditFinder(name)}>
        <ListItemText primary={name}/>
    </ListItem>
);

const FindersList = ({t, classes, selectedType, selectedFinder, mode, selectFinder, updateFinderDialogState}) => {
    const availableFinders = filterAvailableFinders(mode, selectedFinder, selectedType);
    const handleEditFinder = finderName => {
        updateFinderDialogState({open: true, mode: C.DIALOG_MODE_EDIT});
        selectFinder(finderName);
    };
    return (
        <Paper className={classes.paper}>
            <List subheader={
                <ListSubheader className={classes.subHeader}>
                    <Typography color="alpha" variant="zeta">
                        {t('label.sdlGeneratorTools.defineFinder.finders')}
                        <Button variant="ghost"
                                icon={<Add/>}
                                disabled={selectedType === undefined || availableFinders.length === 0}
                                className={classes.listButton}
                                onClick={() => updateFinderDialogState({open: true, mode: C.DIALOG_MODE_ADD})}
                        >
                            {t('label.sdlGeneratorTools.defineFinder.addAFinder')}
                        </Button>
                    </Typography>
                </ListSubheader>}
            >
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
        selectedType: state.nodeTypes[state.selection],
        selectedFinder: state.selectedFinder,
        ...state.addModifyFinderDialog
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
