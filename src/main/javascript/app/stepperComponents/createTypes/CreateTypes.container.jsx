import React from 'react';
import CreateTypes from './CreateTypes';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {sdlAddType, sdlRemoveType, sdlAddPropertyToType, sdlRemovePropertyFromType} from '../../App.redux-actions';
import {sdlSelectType} from '../StepperComponent.redux-actions';

const CreateTypesContainer = ({nodeTypes, selection, addProperty, removeProperty, removeType, addType, selectType}) => (
    <CreateTypes nodeTypes={nodeTypes}
                 selection={selection}
                 addProperty={addProperty}
                 removeProperty={removeProperty}
                 removeType={removeType}
                 addType={addType}
                 selectType={selectType}/>
);

const mapStateToProps = state => (state);

const mapDispatchToProps = dispatch => {
    return {
        addType: typeInfo => dispatch(sdlAddType(typeInfo)),
        removeType: typeName => dispatch(sdlRemoveType(typeName)),
        addProperty: (propertyInfo, typeIndex) => dispatch(sdlAddPropertyToType(propertyInfo, typeIndex)),
        removeProperty: (propertyIndex, typeIndex) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndex)),
        selectType: typeName => dispatch(sdlSelectType(typeName))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateTypesContainer);
