import {actionTypes} from './StepperComponent.redux-actions';
import {isPredefinedType} from '../util/helperFunctions';

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

const selectedPropertyReducer = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SDL_SELECT_PROPERTY:
            return {
                propertyIndex: action.propertyIndex,
                propertyName: action.propertyName,
                propertyType: action.propertyType,
                jcrPropertyName: action.jcrPropertyName,
                isPredefinedType: isPredefinedType(action.propertyType)
            };
        default: return state;
    }
};

export {
    selectionReducer,
    selectedFinderReducer,
    selectedPropertyReducer
};
