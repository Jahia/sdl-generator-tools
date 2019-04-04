import React from 'react';
import PropTypes from 'prop-types';
import {Button, List, ListItem, ListItemText, ListSubheader, withStyles} from '@material-ui/core';
import C from '../../../../App.constants';
import {Add} from '@material-ui/icons';
import {Typography, Paper} from '@jahia/ds-mui-theme';
import {
    sdlSelectFinder,
    sdlUpdateAddModifyFinderDialog
} from '../../StepperComponent.redux-actions';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {filterAvailableFinders} from '../DefineFinders.utils';

/* eslint-disable */
const styles = theme => ({
    paper: {
        width: '100%',
        minHeight: '35vh',
        padding: theme.spacing.unit * 2 + 'px 0',
        overflowY: 'auto'
    },
    listButton: {
        '& > * *': {
            color: theme.palette.brand.alpha
        }
    }
});
/* eslint-disable */

const FinderItem = ({name, handleEditFinder}) => (
    <ListItem button onClick={() => handleEditFinder(name)}>
        <ListItemText primary={name}/>
    </ListItem>
);

FinderItem.propTypes = {
    name: PropTypes.string.isRequired,
    handleEditFinder: PropTypes.func.isRequired
};

const FindersList = ({t, classes, selectedType, selectedFinder, mode, selectFinder, updateFinderDialogState}) => {
    const availableFinders = filterAvailableFinders(mode, selectedFinder, selectedType);
    const handleEditFinder = finderName => {
        updateFinderDialogState({open: true, mode: C.DIALOG_MODE_EDIT});
        selectFinder(finderName);
    };
    return (
        <Paper className={classes.paper}>
            <List subheader={
                <ListSubheader>
                    <Typography color="alpha" variant="zeta">
                        {t('label.sdlGeneratorTools.defineFinder.finders')}
                    </Typography>
                </ListSubheader>}
            >
                <ListItem>
                    <Button disabled={selectedType === undefined || availableFinders.length === 0}
                            className={classes.listButton}
                            onClick={() => updateFinderDialogState({open: true, mode: C.DIALOG_MODE_ADD})}
                    >
                        <Typography color={selectedType !== undefined ? 'alpha' : ''} variant="zeta">
                            {t('label.sdlGeneratorTools.defineFinder.addAFinder')}
                        </Typography>
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

FindersList.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    selectedType: PropTypes.object.isRequired,
    selectedFinder: PropTypes.string,
    mode: PropTypes.string.isRequired,
    selectFinder: PropTypes.func.isRequired,
    updateFinderDialogState: PropTypes.func.isRequired
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