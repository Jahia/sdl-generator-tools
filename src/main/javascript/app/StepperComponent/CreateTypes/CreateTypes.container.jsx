import CreateTypes from './CreateTypes';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {batchActions} from 'redux-batched-actions';
import {
    sdlRemoveType,
    sdlAddPropertyToType,
    sdlRemovePropertyFromType
} from '../../App.redux-actions';
import {sdlSelectType, sdlSelectProperty, sdlUpdateSelectedProperty, sdlUpdateAddModifyPropertyDialog} from '../StepperComponent.redux-actions';

const CreateTypesContainer = ({nodeTypes, selection, selectedProperty, dispatch, dispatchBatch, addProperty, removeProperty, removeType, removeArgFromDirective, selectType, selectProperty, addModifyPropertyDialog}) => (
    <CreateTypes nodeTypes={nodeTypes}
                 dispatch={dispatch}
                 dispatchBatch={dispatchBatch}
                 selection={selection}
                 selectedProperty={selectedProperty}
                 addProperty={addProperty}
                 addModifyPropertyDialog={addModifyPropertyDialog}
                 removeProperty={removeProperty}
                 removeType={removeType}
                 removeArgFromDirective={removeArgFromDirective}
                 selectType={selectType}
                 selectProperty={selectProperty}/>
);

const mapStateToProps = state => {
    return {
        nodeTypes: state.nodeTypes,
        selection: state.selection
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeType: typeName => dispatch(sdlRemoveType(typeName)),
        addProperty: (propertyInfo, typeIndex) => dispatch(sdlAddPropertyToType(propertyInfo, typeIndex)),
        updateSelectedProp: propertyFields => dispatch(sdlUpdateSelectedProperty(propertyFields)),
        removeProperty: (propertyIndex, typeIndexOrName) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndexOrName)),
        selectType: typeName => dispatch(sdlSelectType(typeName)),
        selectProperty: (propertyIndex, propertyName, jcrPropertyName, propertyType) => dispatch(sdlSelectProperty(propertyIndex, propertyName, jcrPropertyName, propertyType)),
        addModifyPropertyDialog: updateObject => dispatch(sdlUpdateAddModifyPropertyDialog(updateObject)),
        dispatch: action => dispatch(action),
        dispatchBatch: actions => dispatch(batchActions(actions))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateTypesContainer);
