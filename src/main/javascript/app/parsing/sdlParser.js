import exampleTypes from './typesExample.js';

export default class SDLParser {
    static parse(types) {
        // For testing purposes
        // console.log(parseTypes(exampleTypes));
        console.log(parseTypes(types));
        return parseTypes(types);
    }
}

const parseTypes = types => {
    let parsedTypes = [];
    let parsedQueries = [];
    types.map(type => {
        let description = formatDescription(type.description);
        parsedTypes.push(`${description !== null ? `${description}\n` : ''}type ${type.name} ${parseDirectives(type.directives)} {\n\t${parseFields(type.fieldDefinitions).join('\n\t')}\n}`);
        parsedQueries = parsedQueries.concat(parseQueries(type.queries, type.name));
    });
    return `${parsedTypes.join('\n')}${parsedQueries.length > 0 ? `\n\nextend type Query {\n\t${parsedQueries.join('\n\t')}\n}` : ''}`;
};

const parseQueries = (queries, type) => {
    let parsedQueries = [];
    queries.map(query => {
        parsedQueries.push(`${query.name}: ${query.multiple ? `[${type}]` : type}`);
    });
    return parsedQueries;
};

const parseFields = fields => {
    let parsedFields = [];
    fields.map(field => {
        let parsedDirectives = field.directives != null ? parseDirectives(field.directives) : '';
        let description = formatDescription(field.description);
        parsedFields.push(`${description !== null ? `${description}\n\t` : ''}${field.name}: ${field.type} ${parsedDirectives}`);
    });
    return parsedFields;
};

const parseDirectives = directives => {
    let parsedDirectives = [];
    directives.map(directive => {
        parsedDirectives.push(`@${directive.name}(${parseArguments(directive.arguments)})`);
    });
    return parsedDirectives.join(' ');
};

const parseArguments = args => {
    let parsedArguments = [];
    args.map(arg => {
        parsedArguments.push(`${arg.name}: ${formatVal(arg.value)}`);
    });
    return parsedArguments.join(', ');
    function formatVal(val) {
        return typeof val === 'boolean' || typeof val === 'number' ? val : `"${val}"`;
    }
};

const formatDescription = description => {
    return description != null && description.length > 0 ? `"""${description}"""` : null;
};
