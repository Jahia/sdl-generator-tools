const constants = {
    DIALOG_MODE_ADD: 'DIALOG_MODE_ADD',
    DIALOG_MODE_EDIT: 'DIALOG_MODE_EDIT',
    TYPE_LIST_MODE_DISPLAY: 'TYPE_LIST_MODE_DISPLAY',
    TYPE_LIST_MODE_CREATE: 'TYPE_LIST_MODE_CREATE',
    PREDEFINED_SDL_TYPES: ['Asset', 'ImageAsset', 'Metadata'],
    JCR_TO_SDL_TYPE_MAP: {
        NAME: 'String',
        STRING: 'String',
        DATE: 'Date',
        BOOLEAN: 'Boolean',
        LONG: 'Long',
        FLOAT: 'Float',
        DECIMAL: 'BigDecimal',
        DOUBLE: 'BigDecimal'
    },
    RESERVED_JCR_TYPES: [
        'jcr:uuid',
        'jcr:created',
        'jcr:createdBy',
        'jcr:lastModified',
        'jcr:lastModifiedBy'
    ],
    LOCAL_STORAGE: 'sdlLocalStore',
    CHANNEL_PROPERTY: 'PROPERTY',
    CHANNEL_MAP_TO_TYPE: 'MAP_TO_TYPE',
    MULTIPLE_CHILDREN_INDICATOR: '*'
};

export default constants;
