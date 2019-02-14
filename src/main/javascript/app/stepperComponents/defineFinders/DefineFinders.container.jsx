import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {sdlAddFinderToType, sdlRemoveFinderFromType} from '../../App.redux-actions';
import DefineFinders from './DefineFinders';
import {sdlSelectType} from '../StepperComponent.redux-actions';

const DefineFinderContainer = ({nodeTypes, addFinder, removeFinder, selectType, selection}) => {
    return (
        <DefineFinders nodeTypes={nodeTypes}
                       selection={selection}
                       addFinder={addFinder}
                       removeFinder={removeFinder}
                       selectType={selectType}
            />
    );
};

const mapStateToProps = state => {
    return state;
};

const mapDispatchToProps = dispatch => {
    return {
        addFinder: (finderInfo, typeIndex) => dispatch(sdlAddFinderToType(finderInfo, typeIndex)),
        removeFinder: (finderIndex, typeIndex) => dispatch(sdlRemoveFinderFromType(finderIndex, typeIndex)),
        selectType: typeName => dispatch(sdlSelectType(typeName))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(DefineFinderContainer);
