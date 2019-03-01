const actionTypes = {
    SDL_SELECT_TYPE: 'SDL_SELECT_TYPE',
    SDL_SELECT_PROPERTY: 'SDL_SELECT_PROPERTY',
    SDL_UPDATE_SELECTED_PROPERTY: 'SDL_UPDATE_SELECTED_PROPERTY',
    SDL_SELECT_FINDER: 'SDL_SELECT_FINDER',
    SDL_UPDATE_ADD_MOD_PROPERTY_DIALOG: 'SDL_UPDATE_ADD_MOD_PROPERTY_DIALOG'
};

const sdlSelectType = typeName => ({
    type: actionTypes.SDL_SELECT_TYPE,
    typeName: typeName
});

const sdlSelectProperty = (propertyIndex, propertyName, jcrPropertyName, propertyType) => ({
    type: actionTypes.SDL_SELECT_PROPERTY,
    propertyIndex: propertyIndex,
    propertyName: propertyName,
    jcrPropertyName: jcrPropertyName,
    propertyType: propertyType
});

const sdlUpdateSelectedProperty = (propertyFields) => ({
    type: actionTypes.SDL_UPDATE_SELECTED_PROPERTY,
    propertyFields: propertyFields
});

const sdlSelectFinder = finderName => ({
    type: actionTypes.SDL_SELECT_FINDER,
    finderName: finderName
});

const sdlUpdateAddModifyPropertyDialog = updateObject => ({
    type: actionTypes.SDL_UPDATE_ADD_MOD_PROPERTY_DIALOG,
    updateObject: updateObject
});

export {
    actionTypes,
    sdlSelectType,
    sdlSelectProperty,
    sdlSelectFinder,
    sdlUpdateSelectedProperty,
    sdlUpdateAddModifyPropertyDialog
};
