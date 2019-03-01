import React from 'react';
import {connect} from 'react-redux';
import StepperComponent from './StepperComponent';

const StepperComponentContainer = ({nodeTypes}) => (
        <StepperComponent nodeTypes={nodeTypes}/>
);

const mapStateToProps = state => {
    return state;
};

export default connect(mapStateToProps)(StepperComponentContainer);
