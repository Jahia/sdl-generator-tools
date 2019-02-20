import gql from 'graphql-tag';

const gqlQueries = {
    NODE_TYPE_NAMES: gql`query getNodeTypeNames($namePrefix: String!) {
        nodeTypeNames(namePrefix:$namePrefix) {
            name
        }
    }`
}

export default gqlQueries;
