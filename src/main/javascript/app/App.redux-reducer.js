import {actionTypes} from './App.redux-actions';
import {getInitialObject} from './App.redux-initializers';

const nodeTypesReducer = (state = [], action) => {
    switch (action.type) {
        case actionTypes.SDL_ADD_TYPE:
            return state.concat(getInitialObject(actionTypes.SDL_ADD_TYPE, action.typeInfo));
        case actionTypes.SDL_REMOVE_TYPE:
            return state.filter(type => type.name !== action.typeName);
        case actionTypes.SDL_ADD_PROPERTY_TO_TYPE:
            return state.map((type, index) => {
                if (index !== action.typeIndex) {
                    return type;
                }
                return {
                    ...type,
                    fieldDefinitions: type.fieldDefinitions.concat(getInitialObject(actionTypes.SDL_ADD_PROPERTY_TO_TYPE, action.propertyInfo))
                };
            });
        case actionTypes.SDL_REMOVE_PROPERTY_FROM_TYPE:
            return state.map((type, index) => {
                if (index !== action.typeIndex) {
                    return type;
                }
                return {
                    ...type,
                    fieldDefinitions: type.fieldDefinitions.filter((field, index) => index !== action.propertyIndex)
                };
            });
        default: return state;
    }
};

export {nodeTypesReducer};
