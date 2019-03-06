import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {Grid} from '@material-ui/core';
import AddModifyFinderDialog from './AddModifyFinderDialog';
import {compose} from 'react-apollo';
import {upperCaseFirst} from '../StepperComponent.utils';
import C from '../../App.constants';
import TypesList from '../CreateTypes/TypesList';
import FindersList from './FindersList';
import connect from 'react-redux/es/connect/connect';

const DefineFinders = ({mode, selectedType, selectedFinder}) => {
    const availableFinders = selectedType ? filterAvailableFinders(selectedType) : [];

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <TypesList mode={C.TYPE_LIST_MODE_DISPLAY}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FindersList availableFinders={availableFinders}/>
                </Grid>
            </Grid>
            <AddModifyFinderDialog availableFinders={availableFinders}/>
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
        if (mode === C.DIALOG_MODE_EDIT) {
            return selectedType.queries.find(finder => finder.name === selectedFinder);
        }
        return undefined;
    }
};

const mapStateToProps = state => {
    return {
        selectedType: state.nodeTypes[state.selection],
        selectedFinder: state.selectedFinder,
        ...state.addModifyFinderDialog
    };
};

DefineFinders.propTypes = {
    selectedType: PropTypes.object.isRequired,
    selectedFinder: PropTypes.func.isRequired
};

export default compose(
    connect(mapStateToProps, null),
)(DefineFinders);
