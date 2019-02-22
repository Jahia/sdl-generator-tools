import {actionTypes} from './StepperComponent.redux-actions';

const selectionReducer = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SDL_SELECT_TYPE:
            return action.typeName;
        default: return state;
    }
};

const selectedFinderReducer = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SDL_SELECT_FINDER:
            return action.finderName;
        default: return state;
    }
};

export {
    selectionReducer,
    selectedFinderReducer
};
