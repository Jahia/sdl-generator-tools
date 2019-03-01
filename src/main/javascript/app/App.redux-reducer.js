import {actionTypes} from './App.redux-actions';
import {getInitialObject} from './App.redux-initializers';

const nodeTypesReducer = (state = [], action) => {
    switch (action.type) {
        case actionTypes.SDL_ADD_TYPE:
            return state.concat(getInitialObject(actionTypes.SDL_ADD_TYPE, action.typeInfo));
        case actionTypes.SDL_EDIT_TYPE:
            return state.map(type => {
                if (type.name === action.typeInfo.typeName) {
                    return {
                        ...type,
                        directives: getInitialObject(actionTypes.SDL_ADD_TYPE, action.typeInfo).directives
                    };
                }
                return type;
            });
        case actionTypes.SDL_REMOVE_TYPE:
            return state.filter(type => type.name !== action.typeName);
        case actionTypes.SDL_ADD_PROPERTY_TO_TYPE:
            return state.map((type, index) => {
                if (index === action.typeIndexOrName || type.name === action.typeIndexOrName) {
                    return {
                        ...type,
                        fieldDefinitions: type.fieldDefinitions.concat(getInitialObject(actionTypes.SDL_ADD_PROPERTY_TO_TYPE, action.propertyInfo))
                    };
                }
                return type;
            });
        case actionTypes.SDL_UPDATE_PROPERTY_OF_TYPE:
            console.log("A", action)
            return state.map((type, index) => {
                if (index === action.typeIndexOrName || type.name === action.typeIndexOrName) {
                    type.fieldDefinitions.splice(action.propertyIndex, 1, getInitialObject(actionTypes.SDL_ADD_PROPERTY_TO_TYPE, action.propertyInfo));
                    return {
                        ...type,
                        fieldDefinitions: type.fieldDefinitions.slice()
                    };
                }
                return type;
            });
        case actionTypes.SDL_REMOVE_PROPERTY_FROM_TYPE:
            return state.map((type, index) => {
                if (index !== action.typeIndexOrName && type.name !== action.typeIndexOrName) {
                    return type;
                }
                return {
                    ...type,
                    fieldDefinitions: type.fieldDefinitions.filter((field, index) => index !== action.propertyIndex)
                };
            });
        case actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE:
            return state.map((type, index) => {
                if (index === action.typeIndexOrName || type.name === action.typeIndexOrName) {
                    return {
                        ...type,
                        directives: type.directives.map(dir => {
                            if (dir.name !== action.directiveName) {
                                return dir;
                            }
                            return {
                                ...dir,
                                arguments: dir.arguments.concat(getInitialObject(actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE, action.argumentInfo))
                            };
                        })
                    };
                }
                return type;
            });
        case actionTypes.SDL_REMOVE_DIRECTIVE_ARG_FROM_TYPE:
            return state.map((type, index) => {
                if (index !== action.typeIndex) {
                    return type;
                }
                return {
                    ...type,
                    directives: type.directives.map(dir => {
                        if (dir.name !== action.directiveName) {
                            return dir;
                        }
                        return {
                            ...dir,
                            arguments: dir.arguments.filter((arg, index) => index !== action.argumentIndex)
                        };
                    })
                };
            });
        case actionTypes.SDL_ADD_FINDER_TO_TYPE:
            return state.map((type, index) => {
                if (index === action.typeIndexOrName || type.name === action.typeIndexOrName) {
                    return {
                        ...type,
                        queries: type.queries.concat(getInitialObject(actionTypes.SDL_ADD_FINDER_TO_TYPE, action.finderInfo))
                    };
                }
                return type;
            });
        case actionTypes.SDL_MODIFY_FINDER_OF_TYPE:
            return state.map((type, index) => {
                if (index === action.typeIndexOrName || type.name === action.typeIndexOrName) {
                    return {
                        ...type,
                        queries: type.queries.reduce((acc, curr, idx) => {
                            if (idx === action.finderIndex) {
                                acc.push(getInitialObject(actionTypes.SDL_MODIFY_FINDER_OF_TYPE, action.finderInfo));
                            } else {
                                acc.push(curr);
                            }
                            return acc;
                        }, [])
                    };
                }
                return type;
            });
        case actionTypes.SDL_REMOVE_FINDER_FROM_TYPE:
            return state.map((type, index) => {
                if (index !== action.typeIndexOrName && type.name !== action.typeIndexOrName) {
                    return type;
                }
                return {
                    ...type,
                    queries: type.queries.filter((query, index) => index !== action.finderIndexOrName && query.name !== action.finderIndexOrName)
                };
            });
        default: return state;
    }
};

export {nodeTypesReducer};
