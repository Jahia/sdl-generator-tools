import * as _ from "lodash";

const upperCaseFirst = val => {
    return val.substr(0, 1).toUpperCase().concat(val.substr(1));
};

const getMappingDirective = selectedType => {
    if (!_.isNil(selectedType) && !_.isNil(selectedType.directives) && selectedType.directives.length > 0) {
        const mappingDirective = selectedType.directives.filter(directive => directive.name === 'mapping');
        return !_.isNil(mappingDirective) ? mappingDirective[0].arguments : null;
    } else {
        return null;
    }
}

const getNodeTypeInfo = selectedType => {
    const mappingDirective = getMappingDirective(selectedType);
    if (!_.isNil(mappingDirective)) {
        const nodeArg =  mappingDirective.filter(argument => argument.name === 'node')[0];
        return !_.isNil(nodeArg) ? nodeArg.value : '';
    }
    return '';
};

const getNodeTypeIgnoreDefaultQueries = selectedType => {
    const mappingDirective = getMappingDirective(selectedType);
    if (!_.isNil(mappingDirective)) {
        const defaultQueriesArg = mappingDirective.filter(argument => argument.name === 'ignoreDefaultQueries')[0];
        return !_.isNil(defaultQueriesArg) ? defaultQueriesArg.value : false;
    }
    return false;
};

export {
    upperCaseFirst,
    getMappingDirective,
    getNodeTypeInfo,
    getNodeTypeIgnoreDefaultQueries
};
