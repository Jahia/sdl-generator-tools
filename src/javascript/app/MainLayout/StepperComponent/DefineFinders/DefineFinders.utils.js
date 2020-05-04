import * as _ from 'lodash';
import {generateFinderSuffix, isPredefinedType} from '../StepperComponent.utils';
import C from '../../../App.constants';

const filterAvailableFinders = (mode, selectedFinder, selectedType) => {
    if (!selectedType) {
        return [];
    }

    let finders = ['all', 'allConnection'];
    // Check and filter out all/allConnection if it already is mapped to an existing finder
    finders = _.without(finders, ...selectedType.queries.filter(finder => finders.indexOf(finder.suffix) !== -1).map(finder => finder.suffix));
    // Add finders based on type properties, omit those that have already been created.
    finders = selectedType.fieldDefinitions.reduce((acc, curr) => {
        // Skip finders for properties mapping to predefined types
        if (isPredefinedType(curr.type) && !curr.isWeakreference) {
            return acc;
        }

        let suffix = generateFinderSuffix(curr.name);
        let connectionVariantExists = false;
        if (selectedType.queries.reduce((found, query) => {
            if (suffix.connection === query.suffix) {
                connectionVariantExists = true;
            }

            return query.suffix === suffix.standard ? false : found;
        }, true)) {
            acc.push(suffix.standard);
        }

        if (!connectionVariantExists) {
            acc.push(suffix.connection);
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
