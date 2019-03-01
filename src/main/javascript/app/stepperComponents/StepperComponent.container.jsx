import React from 'react';
import {connect} from 'react-redux';
import StepperComponent from './StepperComponent';
import {compose} from 'react-apollo';

const mapStateToProps = state => {
    return state;
};

export default compose(
    connect(mapStateToProps, null)
)(StepperComponent);
