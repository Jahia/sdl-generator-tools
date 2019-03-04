import CreateTypes from './CreateTypes';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {batchActions} from 'redux-batched-actions';
import {
    sdlRemoveType,
    sdlAddPropertyToType,
    sdlRemovePropertyFromType
} from '../../App.redux-actions';
import {sdlSelectType, sdlSelectProperty} from '../StepperComponent.redux-actions';

const mapStateToProps = state => (state);

const mapDispatchToProps = dispatch => {
    return {
        removeType: typeName => dispatch(sdlRemoveType(typeName)),
        addProperty: (propertyInfo, typeIndex) => dispatch(sdlAddPropertyToType(propertyInfo, typeIndex)),
        removeProperty: (propertyIndex, typeIndexOrName) => dispatch(sdlRemovePropertyFromType(propertyIndex, typeIndexOrName)),
        selectType: typeName => dispatch(sdlSelectType(typeName)),
        selectProperty: (propertyIndex, propertyName, jcrPropertyName, propertyType) => dispatch(sdlSelectProperty(propertyIndex, propertyName, jcrPropertyName, propertyType)),
        dispatch: action => dispatch(action),
        dispatchBatch: actions => dispatch(batchActions(actions))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateTypes);
