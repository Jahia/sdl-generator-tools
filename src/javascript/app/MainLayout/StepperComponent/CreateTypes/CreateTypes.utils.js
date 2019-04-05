import * as _ from 'lodash';

const convertTypesToSelectOptions = (nodeTypes, doSort) => {
    if (_.isNil(nodeTypes)) {
        return null;
    }

    const options = nodeTypes.map(type => (
        {
            label: type.displayName,
            value: type.name
        }
    ));
    return doSort ? _.sortBy(options, [option => option.label.toUpperCase()]) : options;
};

export {
    convertTypesToSelectOptions
};
