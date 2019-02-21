import React from 'react';
import CreateTypes from './CreateTypes';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {batchActions} from 'redux-batched-actions';
import {
    sdlRemoveType,
    sdlAddPropertyToType,
    sdlRemovePropertyFromType
} from '../../App.redux-actions';
import {sdlSelectType} from '../StepperComponent.redux-actions';

const CreateTypesContainer = ({nodeTypes, selection, dispatch, dispatchBatch, addProperty, removeProperty, removeType, removeArgFromDirective, selectType}) => (
    <CreateTypes nodeTypes={nodeTypes}
                 dispatch={dispatch}
                 dispatchBatch={dispatchBatch}
                 selection={selection}
                 addProperty={addProperty}
                 removeProperty={removeProperty}
                 removeType={removeType}
                 removeArgFromDirective={removeArgFromDirective}
                 selectType={selectType}/>
);

const mapStateToProps = state => (state);

const mapDispatchToProps = dispatch => {
    return {
        removeType: typeName => dispatch(sdlRemoveType(typeName)),
        addProperty: (propertyInfo, typeIndex) => dispatch(sdlAddPropertyToType(propertyInfo, typeIndex)),
        removeProperty: (propertyIndex, typeIndex) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndex)),
        selectType: typeName => dispatch(sdlSelectType(typeName)),
        dispatch: action => dispatch(action),
        dispatchBatch: actions => dispatch(batchActions(actions))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateTypesContainer);
