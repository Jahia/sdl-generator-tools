import gql from 'graphql-tag';

const gqlQueries = {
    NODE_TYPE_NAMES: gql`query getNodeTypeNames {
        jcr {
            nodeTypes(filter:{includeTypes:"jmix:editorialContent", includeMixins:false}) {
              nodes {
                name
                displayName(language:"en")
              }
            }
        }
    }`,
    NODE_TYPE_PROPERTIES: gql`query getNodeTypeProperties($includeTypes: [String!]) {
        jcr {
            nodeTypes(filter: {includeTypes: $includeTypes}){
                nodes{
                    name
                    properties{
                        name
                        requiredType
                    }
                }
            }
        }
    }`
};

export default gqlQueries;