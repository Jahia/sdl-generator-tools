import React from 'react';
import CreateTypes from './CreateTypes';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {
    sdlAddType,
    sdlRemoveType,
    sdlAddPropertyToType,
    sdlRemovePropertyFromType,
    sdlAddDirectiveArgToType,
    sdlRemoveDirectiveArgFromType
} from '../../App.redux-actions';
import {sdlSelectType} from '../StepperComponent.redux-actions';

const CreateTypesContainer = ({nodeTypes, selection, addProperty, removeProperty, removeType, addType, addArgToDirective, removeArgFromDirective, selectType}) => (
    <CreateTypes nodeTypes={nodeTypes}
                 selection={selection}
                 addProperty={addProperty}
                 removeProperty={removeProperty}
                 removeType={removeType}
                 addType={addType}
                 addArgToDirective={addArgToDirective}
                 removeArgFromDirective={removeArgFromDirective}
                 selectType={selectType}/>
);

const mapStateToProps = state => (state);

const mapDispatchToProps = dispatch => {
    return {
        addType: typeInfo => dispatch(sdlAddType(typeInfo)),
        removeType: typeName => dispatch(sdlRemoveType(typeName)),
        addProperty: (propertyInfo, typeIndex) => dispatch(sdlAddPropertyToType(propertyInfo, typeIndex)),
        removeProperty: (propertyIndex, typeIndex) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndex)),
        selectType: typeName => dispatch(sdlSelectType(typeName)),
        addArgToDirective: (typeIndex, directiveName, arg) => dispatch(sdlAddDirectiveArgToType(typeIndex, directiveName, arg)),
        removeArgFromDirective: (typeIndex, directiveName, argIndex) => dispatch(sdlRemoveDirectiveArgFromType(typeIndex, directiveName, argIndex))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateTypesContainer);
