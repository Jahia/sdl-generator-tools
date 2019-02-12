import {actionTypes} from './App.redux-actions';

const addType = typeInfo => (Object.assign({}, {
    name: typeInfo.typeName,
    description: null,
    queryName: null,
    fieldDefinitions: [],
    directives: [
        {
            name: 'mapping',
            arguments: [
                {
                    name: 'node',
                    value: typeInfo.nodeType
                }
            ]
        }
    ]
}));

const getInitialObject = (actionType, vars) => {
    switch (actionType) {
        case actionTypes.SDL_ADD_TYPE:
            return addType(vars);
        default: return {};
    }
};

export {getInitialObject};
