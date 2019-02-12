const actionTypes = {
    SDL_ADD_TYPE: 'SDL_ADD_TYPE'
};

const sdlAddType = typeInfo => ({
    type: actionTypes.SDL_ADD_TYPE,
    typeInfo: typeInfo
});

export {actionTypes, sdlAddType};

