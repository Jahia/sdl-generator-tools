import React from 'react';
import ToolsSteps from './ToolsSteps';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

const ToolsStepsContainer = ({nodeTypes}) => (
    <ToolsSteps nodeTypes={nodeTypes}/>
);

const mapStateToProps = state => {
    return state;
};

export default compose(
    connect(mapStateToProps)
)(ToolsStepsContainer);
