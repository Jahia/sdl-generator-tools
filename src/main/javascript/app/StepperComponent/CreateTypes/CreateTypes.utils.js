import * as _ from "lodash";

const convertTypesToSelectOptions = nodeTypes => {
    if (_.isNil(nodeTypes)) {
        return null;
    }
    const options = nodeTypes.map(type => (
        {
            label: type.displayName,
            value: type.name
        }
    ));
    return _.sortBy(options, 'label');
}

export {
    convertTypesToSelectOptions
}
