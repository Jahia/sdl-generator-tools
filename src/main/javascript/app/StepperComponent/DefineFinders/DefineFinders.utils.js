import * as _ from 'lodash';
import {upperCaseFirst} from '../StepperComponent.utils';
import C from '../../App.constants';

const filterAvailableFinders = (mode, selectedFinder, selectedType) => {
    if (!selectedType) {
        return [];
    }
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

    function getSelectedFinder() {
        if (mode === C.DIALOG_MODE_EDIT) {
            return selectedType.queries.find(finder => finder.name === selectedFinder);
        }
        return undefined;
    }
};

export {filterAvailableFinders};
