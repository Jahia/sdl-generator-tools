import {actionTypes} from './App.redux-actions';
import {getInitialObject} from './App.redux-initializers';
import {generateUUID} from './App.utils';
import {lookUpMappingStringArgumentInfo} from './StepperComponent/StepperComponent.utils';

const nodeTypesReducer = (state = {}, action) => {
    const newState = {
        ...state
    };
    switch (action.type) {
        case actionTypes.SDL_INIT_NODE_TYPES:
            return action.nodeTypes;
        case actionTypes.SDL_ADD_TYPE:
            const uuid = action.uuid ? action.uuid : generateUUID();
            newState[uuid] = getInitialObject(actionTypes.SDL_ADD_TYPE, action.typeInfo);
            return newState;
        case actionTypes.SDL_UPDATE_TYPE:
            const nodeType = lookUpMappingStringArgumentInfo(newState[action.uuid], 'node');
            if (nodeType === action.typeInfo.nodeType) { // If just update type name, keep all other properties
                newState[action.uuid] = {
                    ...newState[action.uuid],
                    name: action.typeInfo.typeName
                };
            } else {
                newState[action.uuid] = getInitialObject(actionTypes.SDL_ADD_TYPE, action.typeInfo);
            }
            return newState;
        case actionTypes.SDL_REMOVE_TYPE:
            delete newState[action.typeName];
            return newState;
        case actionTypes.SDL_ADD_PROPERTY_TO_TYPE:
            newState[action.typeIndexOrName] = {
                ...newState[action.typeIndexOrName],
                fieldDefinitions: newState[action.typeIndexOrName].fieldDefinitions.concat(getInitialObject(actionTypes.SDL_ADD_PROPERTY_TO_TYPE, action.propertyInfo))
            };
            return newState;
        case actionTypes.SDL_UPDATE_PROPERTY_OF_TYPE:
            newState[action.typeIndexOrName].fieldDefinitions.splice(action.propertyIndex, 1, getInitialObject(actionTypes.SDL_ADD_PROPERTY_TO_TYPE, action.propertyInfo));
            newState[action.typeIndexOrName] = {
                ...newState[action.typeIndexOrName],
                fieldDefinitions: newState[action.typeIndexOrName].fieldDefinitions.slice()
            };
            return newState;
        case actionTypes.SDL_REMOVE_PROPERTY_FROM_TYPE:
            newState[action.typeIndexOrName] = {
                ...newState[action.typeIndexOrName],
                fieldDefinitions: newState[action.typeIndexOrName].fieldDefinitions.filter((field, index) => index !== action.propertyIndex)
            };
            return newState;
        case actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE:
            newState[action.typeIndexOrName] = {
                ...newState[action.typeIndexOrName],
                directives: newState[action.typeIndexOrName].directives.map(dir => {
                    if (dir.name !== action.directiveName) {
                        return dir;
                    }
                    return {
                        ...dir,
                        arguments: dir.arguments.concat(getInitialObject(actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE, action.argumentInfo))
                    };
                })
            };
            return newState;
        case actionTypes.SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE:
            newState[action.typeIndex] = {
                ...newState[action.typeIndex],
                directives: newState[action.typeIndex].directives.map(dir => {
                    if (dir.name !== action.directiveName) {
                        return dir;
                    }
                    return {
                        ...dir,
                        arguments: dir.arguments.filter((arg, index) => index !== action.argumentIndex)
                    };
                })
            };
            return newState;
        case actionTypes.SDL_ADD_FINDER_TO_TYPE:
            newState[action.typeIndexOrName] = {
                ...newState[action.typeIndexOrName],
                queries: newState[action.typeIndexOrName].queries.concat(getInitialObject(actionTypes.SDL_ADD_FINDER_TO_TYPE, action.finderInfo))
            };
            return newState;
        case actionTypes.SDL_MODIFY_FINDER_OF_TYPE:
            newState[action.typeIndexOrName] = {
                ...newState[action.typeIndexOrName],
                queries: newState[action.typeIndexOrName].queries.reduce((acc, curr, idx) => {
                    if (idx === action.finderIndex) {
                        acc.push(getInitialObject(actionTypes.SDL_MODIFY_FINDER_OF_TYPE, action.finderInfo));
                    } else {
                        acc.push(curr);
                    }
                    return acc;
                }, [])
            };
            return newState;
        case actionTypes.SDL_REMOVE_FINDER_FROM_TYPE:
            newState[action.typeIndexOrName] = {
                ...newState[action.typeIndexOrName],
                queries: newState[action.typeIndexOrName].queries.filter((query, index) => index !== action.finderIndexOrName && query.name !== action.finderIndexOrName)
            };
            return newState;
        default: return state;
    }
};

export {nodeTypesReducer};
