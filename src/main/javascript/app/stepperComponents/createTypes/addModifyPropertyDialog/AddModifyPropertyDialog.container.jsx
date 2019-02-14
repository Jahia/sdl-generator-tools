import React from 'react';
import CreateTypes from './CreateTypes';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {sdlAddType, sdlRemoveType, sdlAddPropertyToType, sdlRemovePropertyFromType} from '../../App.redux-actions';

const CreateTypesContainer = ({nodeTypes, addProperty, removeProperty, removeType, addType}) => (
    <CreateTypes nodeTypes={nodeTypes}
                 addProperty={addProperty}
                 removeProperty={removeProperty}
                 removeType={removeType}
                 addType={addType}/>
);

const mapStateToProps = state => {
    return state;
};

const mapDispatchToProps = dispatch => {
    return {
        addType: typeInfo => dispatch(sdlAddType(typeInfo)),
        removeType: typeName => dispatch(sdlRemoveType(typeName)),
        addProperty: (propertyInfo, typeIndex) => dispatch(sdlAddPropertyToType(propertyInfo, typeIndex)),
        removeProperty: (propertyIndex, typeIndex) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndex))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateTypesContainer);