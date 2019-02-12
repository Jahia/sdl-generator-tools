import {actionTypes} from './App.redux-actions';
import {getInitialObject} from './App.redux-initializers';

const nodeTypesReducer = (state = [], action) => {
    switch (action.type) {
        case actionTypes.SDL_ADD_TYPE:
            return state.concat(getInitialObject(actionTypes.SDL_ADD_TYPE, action.typeInfo));
        default: return state;
    }
};

export {nodeTypesReducer};
