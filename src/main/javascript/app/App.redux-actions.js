const actionTypes = {
    SDL_ADD_TYPE: 'SDL_ADD_TYPE',
    SDL_REMOVE_TYPE: 'SDL_REMOVE_TYPE',
    SDL_ADD_PROPERTY_TO_TYPE: 'SDL_ADD_PROPERTY_TO_TYPE',
    SDL_REMOVE_PROPERTY_FROM_TYPE: 'SDL_REMOVE_PROPERTY_FROM_TYPE',
    SDL_ADD_DIRECTIVE_ARG_TO_TYPE: 'SDL_ADD_DIRECTIVE_ARG_TO_TYPE',
    SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE: 'SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE',
    SDL_ADD_FINDER_TO_TYPE: 'SDL_ADD_FINDER_TO_TYPE',
    SDL_REMOVE_FINDER_FROM_TYPE: 'SDL_REMOVE_FINDER_FROM_TYPE'
};

const sdlAddType = typeInfo => ({
    type: actionTypes.SDL_ADD_TYPE,
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

const sdlRemovePropertyFromType = (propertyIndex, typeIndex) => ({
    type: actionTypes.SDL_REMOVE_PROPERTY_FROM_TYPE,
    propertyIndex: propertyIndex,
    typeIndex: typeIndex
});

const sdlAddDirectiveArgToType = (typeIndex, directiveName, argumentInfo) => ({
    type: actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE,
    argumentInfo: argumentInfo,
    typeIndex: typeIndex,
    directiveName: directiveName
});

const sdlRemoveDirectiveArgFromType = (typeIndex, directiveName, argumentIndex) => ({
    type: actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE,
    argumentIndex: argumentIndex,
    typeIndex: typeIndex,
    directiveName: directiveName
});

const sdlAddFinderToType = (finderInfo, typeIndexOrName) => ({
    type: actionTypes.SDL_ADD_FINDER_TO_TYPE,
    finderInfo: finderInfo,
    typeIndexOrName: typeIndexOrName
});

const sdlRemoveFinderFromType = (finderIndex, typeIndex) => ({
    type: actionTypes.SDL_REMOVE_FINDER_FROM_TYPE,
    finderInfo: finderIndex,
    typeIndex: typeIndex
});

export {
    actionTypes,
    sdlAddType,
    sdlRemoveType,
    sdlAddPropertyToType,
    sdlRemovePropertyFromType,
    sdlAddDirectiveArgToType,
    sdlRemoveDirectiveArgFromType,
    sdlAddFinderToType,
    sdlRemoveFinderFromType
};

