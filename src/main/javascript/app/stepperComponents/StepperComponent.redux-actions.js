const actionTypes = {
    SDL_SELECT_TYPE: 'SDL_SELECT_TYPE',
    SDL_SELECT_FINDER: 'SDL_SELECT_FINDER'
};

const sdlSelectType = typeName => ({
    type: actionTypes.SDL_SELECT_TYPE,
    typeName: typeName
});

const sdlSelectFinder = finderName => ({
    type: actionTypes.SDL_SELECT_FINDER,
    finderName: finderName
});

export {
    actionTypes,
    sdlSelectType,
    sdlSelectFinder
};
