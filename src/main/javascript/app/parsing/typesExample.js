const exampleTypes = [
    {
        name: 'sdlTest',
        description: 'This is an example type declaration',
        queries: [
            {
                name: 'sdlTestByDate',
                multiple: true
            }
        ],
        fieldDefinitions: [
            {
                name: 'title',
                type: 'String',
                description: 'title of the node',
                directives: [
                    {
                        name: 'mapping',
                        arguments: [
                            {
                                name: 'property',
                                value: 'jcr:title'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'image',
                type: 'AssetImage'
            },
            {
                name: 'other',
                type: 'String!',
                directives: [
                    {
                        name: 'mapping',
                        arguments: [
                            {
                                name: 'property',
                                value: 'jcr:other'
                            }
                        ]
                    }
                ]
            }
        ],
        directives: [
            {
                name: 'mapping',
                arguments: [
                    {
                        name: 'node',
                        value: 'sdl:test'
                    },
                    {
                        name: 'ignoreDefaultQueries',
                        value: false
                    }
                ]
            }
        ]
    },
    {
        name: 'sdlTest2',
        description: 'This is an example type declaration',
        queries: [
            {
                name: 'sdlTest2ById',
                multiple: false
            },
            {
                name: 'allsdlTest2',
                multiple: true
            }
        ],
        fieldDefinitions: [
            {
                name: 'title',
                type: 'String',
                directives: [
                    {
                        name: 'mapping',
                        arguments: [
                            {
                                name: 'property',
                                value: 'jcr:title'
                            }
                        ]
                    }
                ]
            }
        ],
        directives: [
            {
                name: 'mapping',
                arguments: [
                    {
                        name: 'node',
                        value: 'sdl:test'
                    },
                    {
                        name: 'ignoreDefaultQueries',
                        value: true
                    }
                ]
            }
        ]
    },
    {
        name: 'sdlTest3',
        description: 'This is an example type declaration',
        queries: [
            {
                name: 'sdlTest3ByDate',
                multiple: true
            }
        ],
        fieldDefinitions: [
            {
                name: 'title',
                type: 'String',
                directives: [
                    {
                        name: 'mapping',
                        arguments: [
                            {
                                name: 'property',
                                value: 'jcr:title'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'image',
                type: 'AssetImage'
            },
            {
                name: 'other',
                type: 'String!',
                directives: [
                    {
                        name: 'mapping',
                        arguments: [
                            {
                                name: 'property',
                                value: 'jcr:other'
                            }
                        ]
                    }
                ]
            }
        ],
        directives: [
            {
                name: 'mapping',
                arguments: [
                    {
                        name: 'node',
                        value: 'sdl:test'
                    },
                    {
                        name: 'ignoreDefaultQueries',
                        value: false
                    }
                ]
            }
        ]
    }
];

export default exampleTypes;
