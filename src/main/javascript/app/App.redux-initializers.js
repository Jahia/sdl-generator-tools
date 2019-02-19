import {actionTypes} from './App.redux-actions';
import {upperCaseFirst} from './util/helperFunctions';

const addType = typeInfo => (Object.assign({}, {
    name: typeInfo.typeName,
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

const addFinder = finderInfo => (Object.assign({}, {
    name: finderInfo.prefix + upperCaseFirst(finderInfo.suffix),
    prefix: finderInfo.prefix,
    suffix: finderInfo.suffix,
    multiple: finderInfo.multiple
}));

const getInitialObject = (actionType, vars) => {
    switch (actionType) {
        case actionTypes.SDL_ADD_TYPE:
            return addType(vars);
        case actionTypes.SDL_ADD_PROPERTY_TO_TYPE:
            return addProperty(vars);
        case actionTypes.SDL_ADD_DIRECTIVE_ARG_TO_TYPE:
            return addDirectiveArgument(vars);
        case actionTypes.SDL_ADD_FINDER_TO_TYPE:
            return addFinder(vars);
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
