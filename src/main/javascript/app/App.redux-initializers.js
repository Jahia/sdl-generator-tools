import {actionTypes} from './App.redux-actions';

const addType = typeInfo => ({
    name: typeInfo.typeName,
    displayName: typeInfo.displayName,
    description: null,
    queries: [],
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
});

const addProperty = fieldInfo => {
    if (fieldInfo.property === '' || fieldInfo.property === null) {
        return {
            name: fieldInfo.name,
            type: fieldInfo.type,
            directives: []
        };
    }
    return {
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
    };
};

const addDirectiveArgument = argumentInfo => ({
    name: argumentInfo.name,
    value: argumentInfo.value
});

const addFinder = finderInfo => ({
    name: finderInfo.name,
    prefix: finderInfo.prefix,
    suffix: finderInfo.suffix
});

const getInitialObject = (actionType, vars) => {
    switch (actionType) {
        case actionTypes.SDL_ADD_TYPE:
            return addType(vars);
        case actionTypes.SDL_ADD_PROPERTY_TO_TYPE:
            return addProperty(vars);
        case actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE:
            return addDirectiveArgument(vars);
        case actionTypes.SDL_ADD_FINDER_TO_TYPE:
        case actionTypes.SDL_MODIFY_FINDER_OF_TYPE:
            return addFinder(vars);
        default:
            return {};
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
//              {
//                  "name": "node",
//                  "value": "sdl:test"
//              },
//              {
//                  "name": "ignoreDefaultQueries",
//                  "value": true
//              }
//         ]
//     }
// ]
// }
