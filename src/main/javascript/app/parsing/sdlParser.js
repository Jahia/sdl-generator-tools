export default class SDLParser {
    static parse(types) {
        return parseTypes(types);
    }
}

const parseTypes = types => {
    let parsedQueries = [];
    let parsedTypes = types.map(type => {
        let description = formatDescription(type.description);
        parsedQueries = parsedQueries.concat(parseQueries(type.queries, type.name));
        return `${description !== null ? `${description}\n` : ''}type ${type.name} ${parseDirectives(type.directives)} {\n\t${parseFields(type.fieldDefinitions).join('\n\t')}\n}`;
    });
    return `${parsedTypes.join('\n')}${parsedQueries.length > 0 ? `\n\nextend type Query {\n\t${parsedQueries.join('\n\t')}\n}` : ''}`;
};

const parseQueries = (queries, type) => {
    return queries.map(query => {
        if (query.name.endsWith('Connection')) {
            return `${query.name}: ${type}Connection`;
        }
        return `${query.name}: [${type}]`;
    });
};

const parseFields = fields => {
    return fields.map(field => {
        let parsedDirectives = field.directives !== null ? parseDirectives(field.directives) : '';
        let description = formatDescription(field.description);
        return `${description !== null ? `${description}\n\t` : ''}${field.name}: ${field.type} ${parsedDirectives}`;
    });
};

const parseDirectives = directives => {
    return directives.map(directive => `@${directive.name}(${parseArguments(directive.arguments)})`).join(' ');
};

const parseArguments = args => {
    return args.map(arg => `${arg.name}: ${formatVal(arg.value)}`).join(', ');

    function formatVal(val) {
        return typeof val === 'boolean' || typeof val === 'number' ? val : `"${val}"`;
    }
};

const formatDescription = description => {
    return description && description.length > 0 ? `"""${description}"""` : null;
};
