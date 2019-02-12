const actionTypes = {
    SDL_ADD_TYPE: 'SDL_ADD_TYPE',
    SDL_REMOVE_TYPE: 'SDL_REMOVE_TYPE',
    SDL_ADD_PROPERTY_TO_TYPE: 'SDL_ADD_PROPERTY_TO_TYPE',
    SDL_REMOVE_PROPERTY_FROM_TYPE: 'SDL_REMOVE_PROPERTY_FROM_TYPE',
    SDL_ADD_DIRECTIVE_ARG_TO_TYPE: 'SDL_ADD_DIRECTIVE_ARG_TO_TYPE',
    SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE: 'SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE'
};

const sdlAddType = typeInfo => ({
    type: actionTypes.SDL_ADD_TYPE,
    typeInfo: typeInfo
});

const sdlRemoveType = typeName => ({
    type: actionTypes.SDL_REMOVE_TYPE,
    typeName: typeName
});

const sdlAddPropertyToType = (propertyInfo, typeIndex) => ({
    type: actionTypes.SDL_ADD_PROPERTY_TO_TYPE,
    propertyInfo: propertyInfo,
    typeIndex: typeIndex
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

export {
    actionTypes,
    sdlAddType,
    sdlRemoveType,
    sdlAddPropertyToType,
    sdlRemovePropertyFromType,
    sdlAddDirectiveArgToType,
    sdlRemoveDirectiveArgFromType
};

