import gql from 'graphql-tag';

const gqlQueries = {
    // NODE_TYPE_NAMES: gql`query getNodeTypeNames($excludePrefixes: [String]) {
    //     nodeTypeNames(excludePrefixes:$excludePrefixes) {
    //         name
    //     }
    // }`
    NODE_TYPE_NAMES: gql`query getNodeTypeNames {
        jcr {
            nodeTypes(filter:{includeTypes:"jmix:editorialContent", includeMixins:false}) {
              nodes {
                name
                displayName(language:"en")
              }
            }
        }
    }`
};

export default gqlQueries;
