import React from 'react';
import {compose} from "react-apollo";
import connect from "react-redux/es/connect/connect";
import GQLSchemaViewer from "./GQLSchemaViewer";

const GQLSchemaViewerContainer = ({nodeTypes}) => {
  return <GQLSchemaViewer nodeTypes={nodeTypes}/>
};
const mapStateToProps = state => {
    return state;
};

export default compose(
    connect(mapStateToProps, null)
)(GQLSchemaViewerContainer);