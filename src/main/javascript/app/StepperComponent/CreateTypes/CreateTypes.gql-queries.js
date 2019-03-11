import gql from 'graphql-tag';

const gqlQueries = {
    NODE_TYPE_NAMES: gql`query getNodeTypeNames {
        jcr {
            nodeTypes(filter:{includeTypes:"jmix:editorialContent", includeMixins:false}) {
              nodes {
                name
                displayName(language:"en")
                icon
              }
            }
        }
    }`,
    NODE_TYPE_NAMES_BY_SEARCH: gql`query searchNodeTypeNames($keyword: String!) {
        jcr {
            nodeTypes(filter: {
              includeMixins: true
            },fieldFilter: {
              filters: {
                  evaluation: CONTAINS_IGNORE_CASE,
                  fieldName: "name",
                  value: $keyword
                }
              }){
              nodes{
                name
                displayName (language: "en")
                icon
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
                        multiple
                        mandatory
                    }
                    childNodes: nodes {
                        name
                        requiredPrimaryType{
                            name
                        }
                    }
                }
            }
        }
    }`
};

export default gqlQueries;
