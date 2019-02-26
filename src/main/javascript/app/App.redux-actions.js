const actionTypes = {
    SDL_ADD_TYPE: 'SDL_ADD_TYPE',
    SDL_EDIT_TYPE: 'SDL_EDIT_TYPE',
    SDL_REMOVE_TYPE: 'SDL_REMOVE_TYPE',
    SDL_ADD_PROPERTY_TO_TYPE: 'SDL_ADD_PROPERTY_TO_TYPE',
    SDL_REMOVE_PROPERTY_FROM_TYPE: 'SDL_REMOVE_PROPERTY_FROM_TYPE',
    SDL_ADD_DIRECTIVE_ARG_TO_TYPE: 'SDL_ADD_DIRECTIVE_ARG_TO_TYPE',
    SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE: 'SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE',
    SDL_ADD_FINDER_TO_TYPE: 'SDL_ADD_FINDER_TO_TYPE',
    SDL_REMOVE_FINDER_FROM_TYPE: 'SDL_REMOVE_FINDER_FROM_TYPE',
    SDL_MODIFY_FINDER_OF_TYPE: 'SDL_MODIFY_FINDER_OF_TYPE'
};

const sdlAddType = typeInfo => ({
    type: actionTypes.SDL_ADD_TYPE,
    typeInfo: typeInfo
});

const sdlEditType = typeInfo => ({
    type: actionTypes.SDL_EDIT_TYPE,
    typeInfo: typeInfo
});

const sdlRemoveType = typeName => ({
    type: actionTypes.SDL_REMOVE_TYPE,
    typeName: typeName
});

const sdlAddPropertyToType = (propertyInfo, typeIndexOrName) => ({
    type: actionTypes.SDL_ADD_PROPERTY_TO_TYPE,
    propertyInfo: propertyInfo,
    typeIndexOrName: typeIndexOrName
});

const sdlRemovePropertyFromType = (propertyIndex, typeIndexOrName) => ({
    type: actionTypes.SDL_REMOVE_PROPERTY_FROM_TYPE,
    propertyIndex: propertyIndex,
    typeIndexOrName: typeIndexOrName
});

const sdlAddDirectiveArgToType = (typeIndexOrName, directiveName, argumentInfo) => ({
    type: actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE,
    argumentInfo: argumentInfo,
    typeIndexOrName: typeIndexOrName,
    directiveName: directiveName
});

const sdlRemoveDirectiveArgFromType = (typeIndex, directiveName, argumentIndex) => ({
    type: actionTypes.SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE,
    argumentIndex: argumentIndex,
    typeIndex: typeIndex,
    directiveName: directiveName
});

const sdlAddFinderToType = (typeIndexOrName, finderInfo) => ({
    type: actionTypes.SDL_ADD_FINDER_TO_TYPE,
    finderInfo: finderInfo,
    typeIndexOrName: typeIndexOrName
});

const sdlModifyFinderOfType = (typeIndexOrName, finderIndex, finderInfo) => ({
    type: actionTypes.SDL_MODIFY_FINDER_OF_TYPE,
    finderIndex: finderIndex,
    finderInfo: finderInfo,
    typeIndexOrName: typeIndexOrName
});

const sdlRemoveFinderFromType = (typeIndex, finderIndex) => ({
    type: actionTypes.SDL_REMOVE_FINDER_FROM_TYPE,
    finderIndex: finderIndex,
    typeIndex: typeIndex
});

export {
    actionTypes,
    sdlAddType,
    sdlEditType,
    sdlRemoveType,
    sdlAddPropertyToType,
    sdlRemovePropertyFromType,
    sdlAddDirectiveArgToType,
    sdlRemoveDirectiveArgFromType,
    sdlAddFinderToType,
    sdlRemoveFinderFromType,
    sdlModifyFinderOfType
};

