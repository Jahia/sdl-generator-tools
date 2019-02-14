const actionTypes = {
    SDL_SELECT_TYPE: 'SDL_SELECT_TYPE'
};

const sdlSelectType = typeName => ({
    type: actionTypes.SDL_SELECT_TYPE,
    typeName: typeName
});

export {
    actionTypes,
    sdlSelectType
};
