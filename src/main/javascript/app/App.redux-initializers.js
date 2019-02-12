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

const addProperty = fieldInfo => (Object.assign({}, {
    name: fieldInfo.name,
    type: fieldInfo.type,
    directives: [
        {
            name: 'mapping',
            arguments: [
                {
                    name: 'property',
                    value: fieldInfo.property
                }
            ]
        }
    ]
}));

const addDirectiveArgument = argumentInfo => (Object.assign({}, {
    name: argumentInfo.name,
    value: argumentInfo.value
}));

const getInitialObject = (actionType, vars) => {
    switch (actionType) {
        case actionTypes.SDL_ADD_TYPE:
            return addType(vars);
        case actionTypes.SDL_ADD_PROPERTY_TO_TYPE:
            return addProperty(vars);
        case actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE:
            return addDirectiveArgument(vars);
        default: return {};
    }
};

export {getInitialObject};

// Example object
// const exampleType = {
//     "name": "sdlTest",
//     "description": "",
//     "queries": [
//         {
//             "name": "sdlTestByDate",
//             "multiple": true
//         }
//     ],
//     "options": {
//         "ignoreDefaultQueries": false
//     },
//     "fieldDefinitions": [
//     {
//         "name": "title",
//         "type":  "String",
//         "directives": [
//             {
//                 "name": "mapping",
//                 "arguments": [
//                     {
//                         "name": "property",
//                         "value": "jcr:title"
//                     }
//                 ]
//             }
//         ]
//     }
// ],
//     "directives" : [
//     {
//         "name": "mapping",
//         "arguments": [
//             {
//                 "name": "node",
//                 "value": "sdl:test"
//             }
//         ]
//     }
// ]
// }
