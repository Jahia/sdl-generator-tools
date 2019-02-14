import {actionTypes} from './StepperComponent.redux-actions';

const selectionReducer = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SDL_SELECT_TYPE:
            return action.typeName;
        default: return state;
    }
};

export {selectionReducer};
