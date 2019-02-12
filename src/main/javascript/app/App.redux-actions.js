const actionTypes = {
    SDL_ADD_TYPE: 'SDL_ADD_TYPE',
    SDL_REMOVE_TYPE: 'SDL_REMOVE_TYPE',
    SDL_ADD_PROPERTY_TO_TYPE: 'SDL_ADD_PROPERTY_TO_TYPE',
    SDL_REMOVE_PROPERTY_FROM_TYPE: 'SDL_REMOVE_PROPERTY_FROM_TYPE'
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

export {actionTypes, sdlAddType, sdlRemoveType, sdlAddPropertyToType, sdlRemovePropertyFromType};

