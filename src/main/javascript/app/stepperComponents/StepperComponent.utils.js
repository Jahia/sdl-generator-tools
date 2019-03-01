import * as _ from 'lodash';
import C from "../App.constants";

const upperCaseFirst = val => {
    return val.substr(0, 1).toUpperCase().concat(val.substr(1));
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
    const regex = new RegExp(`[\\[]{0,1}${Object.getOwnPropertyNames(C.JCR_TO_SDL_TYPE_MAP).join('|')}[\\]]{0,1}`, 'i');
    return !regex.exec(type);
};

export {
    upperCaseFirst,
    getMappingDirectiveArguments,
    lookUpMappingArgumentIndex,
    lookUpMappingArgumentInfo,
    lookUpMappingStringArgumentInfo,
    lookUpMappingBooleanArgumentInfo,
    isPredefinedType
};
