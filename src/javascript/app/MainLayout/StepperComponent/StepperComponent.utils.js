import * as _ from 'lodash';
import C from '../../App.constants';

const predefinedTypeRegex = new RegExp(`[\\[]{0,1}${Object.getOwnPropertyNames(C.JCR_TO_SDL_TYPE_MAP).join('|')}[\\]]{0,1}`, 'i');

const upperCaseFirst = val => {
    return val ? val.substr(0, 1).toUpperCase().concat(val.substr(1)) : val;
};

const getMappingDirectiveArguments = selected => {
    if (!_.isNil(selected) && !_.isNil(selected.directives) && selected.directives.length > 0) {
        const mappingDirective = selected.directives.filter(directive => directive.name === 'mapping');
        return !_.isNil(mappingDirective) ? mappingDirective[0].arguments : null;
    }
    return null;
};

const lookUpMappingArgumentIndex = (selected, argName) => {
    const mappingDirectiveArgs = getMappingDirectiveArguments(selected);
    if (!_.isNil(mappingDirectiveArgs)) {
        return mappingDirectiveArgs.findIndex(argument => argument.name === argName);
    }
    return null;
};

const lookUpMappingArgumentInfo = (selected, argName) => {
    const mappingDirectiveArgs = getMappingDirectiveArguments(selected);
    if (!_.isNil(mappingDirectiveArgs)) {
        const arg = mappingDirectiveArgs.filter(argument => argument.name === argName)[0];
        return !_.isNil(arg) ? arg.value : null;
    }
    return null;
};

const lookUpMappingStringArgumentInfo = (selected, argName) => {
    const info = lookUpMappingArgumentInfo(selected, argName);
    return !_.isNil(info) ? info : '';
};

const lookUpMappingBooleanArgumentInfo = (selected, argName) => {
    const info = lookUpMappingArgumentInfo(selected, argName);
    return !_.isNil(info) ? info : false;
};

const isPredefinedType = type => {
    if (type === '' || type === null) {
        return false;
    }

    return !predefinedTypeRegex.exec(type);
};

const generateFinderSuffix = name => {
    let standard = `by${upperCaseFirst(name)}`;
    let connection = `${standard}Connection`;
    return {standard: standard, connection: connection};
};

const getAvailableTypeNames = (nodeTypes, selection) => {
    const availableTypes = [];
    if (nodeTypes) {
        for (let key in nodeTypes) {
            /* eslint-disable-next-line */
            if (!nodeTypes.hasOwnProperty(key)) {
                continue;
            }

            const node = nodeTypes[key];
            if (selection !== key) {
                availableTypes.push(node.name);
            }
        }
    }
    return availableTypes;
};

const getAvailablePropertyNames = selectedType => {
    if (!_.isNil(selectedType)) {
        return selectedType.fieldDefinitions.map(field => field.name);
    }
    return [];
};

const formatFinderName = (finderPrefix, finderSuffix) => {
    switch (finderSuffix) {
        case 'all':
            return finderSuffix + upperCaseFirst(finderPrefix);
        case 'allConnection':
            return 'all' + upperCaseFirst(finderPrefix) + 'Connection';
        default:
            return finderPrefix + upperCaseFirst(finderSuffix);
    }
};

export {
    upperCaseFirst,
    getMappingDirectiveArguments,
    lookUpMappingArgumentIndex,
    lookUpMappingArgumentInfo,
    lookUpMappingStringArgumentInfo,
    lookUpMappingBooleanArgumentInfo,
    isPredefinedType,
    generateFinderSuffix,
    getAvailableTypeNames,
    getAvailablePropertyNames,
    formatFinderName
};
