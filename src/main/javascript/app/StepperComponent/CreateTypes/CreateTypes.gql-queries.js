import gql from 'graphql-tag';

const gqlQueries = {
    ALL_NODE_TYPE_NAMES: gql`query getAllNodeTypeNames{
      jcr {
          nodeTypes(filter:{includeMixins:true}) {
            nodes {
              name
              displayName(language:"en")
              icon
            }
          }
      }
    }`,
    DEFAULT_NODE_TYPE_NAMES: gql`query getDefaultNodeTypeNames {
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
                  evaluation: CONTAINS_IGNORE_CASE
                  fieldName: "displayName"
                  value: $keyword
                }
              }, limit: 40){
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
                    properties(fieldFilter: {
                        filters: [
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:uuid"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:primaryType"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:created"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:createdBy"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:baseVersion"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:isCheckedOut"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:versionHistory"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:predecessors"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:predecessors"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:activity"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:mixinTypes"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:lockOwner"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "jcr:lockIsDeep"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:checkinDate"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:locktoken"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:lockTypes"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:deletedChildren"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:processId"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:published"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:workInProgress"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:workInProgressStatus"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:workInProgressLanguages"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:invalidLanguages"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:legacyRuleSettings"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "j:originWS"}
                            {evaluation: DIFFERENT, fieldName: "name", value: "lastReplay"}
                        ]
                      }){
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
