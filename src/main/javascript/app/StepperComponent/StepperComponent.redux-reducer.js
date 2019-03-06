import {actionTypes} from './StepperComponent.redux-actions';
import {isPredefinedType} from './StepperComponent.utils';
import C from '../App.constants';

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
                isPredefinedType: isPredefinedType(action.propertyType),
                isListType: action.propertyType.startsWith('[')
            };
        case actionTypes.SDL_UPDATE_SELECTED_PROPERTY:
            return {
                ...state,
                ...action.propertyFields
            };
        default: return state;
    }
};

const addModifyPropertyDialog = (state = {open: false, mode: C.DIALOG_MODE_ADD}, action) => {
    switch (action.type) {
        case actionTypes.SDL_UPDATE_ADD_MOD_PROPERTY_DIALOG:
            return {
                ...state,
                ...action.updateObject
            };
        default: return state;
    }
};

const addModifyTypeDialog = (state = {open: false, mode: C.DIALOG_MODE_ADD}, action) => {
    switch (action.type) {
        case actionTypes.SDL_UPDATE_ADD_TYPE_DIALOG:
            return {
                ...state,
                ...action.updateObject
            };
        default: return state;
    }
};

const addModifyFinderDialog = (state = {open: false, mode: C.DIALOG_MODE_ADD}, action) => {
    switch (action.type) {
        case actionTypes.SDL_UPDATE_ADD_FINDER_DIALOG:
            return {
                ...state,
                ...action.updateObject
            };
        default: return state;
    }
};

export {
    selectionReducer,
    selectedFinderReducer,
    selectedPropertyReducer,
    addModifyPropertyDialog,
    addModifyTypeDialog,
    addModifyFinderDialog
};
