const actionTypes = {
    SDL_SELECT_TYPE: 'SDL_SELECT_TYPE',
    SDL_SELECT_PROPERTY: 'SDL_SELECT_PROPERTY',
    SDL_SELECT_FINDER: 'SDL_SELECT_FINDER'
};

const sdlSelectType = typeName => ({
    type: actionTypes.SDL_SELECT_TYPE,
    typeName: typeName
});

const sdlSelectProperty = (propertyIndex, propertyName, jcrPropertyName) => ({
    type: actionTypes.SDL_SELECT_PROPERTY,
    propertyIndex: propertyIndex,
    propertyName: propertyName,
    jcrPropertyName: jcrPropertyName
});

const sdlSelectFinder = finderName => ({
    type: actionTypes.SDL_SELECT_FINDER,
    finderName: finderName
});

export {
    actionTypes,
    sdlSelectType,
    sdlSelectProperty,
    sdlSelectFinder
};
