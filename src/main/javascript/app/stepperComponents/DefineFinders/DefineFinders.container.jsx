import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {sdlAddFinderToType, sdlModifyFinderOfType, sdlRemoveFinderFromType} from '../../App.redux-actions';
import DefineFinders from './DefineFinders';
import {sdlSelectFinder, sdlSelectType} from '../StepperComponent.redux-actions';

const DefineFinderContainer = ({nodeTypes, addFinder, modifyFinder, removeFinder, selectType, selectFinder, selectedFinder, selection}) => {
    return (
        <DefineFinders nodeTypes={nodeTypes}
                       selection={selection}
                       addFinder={addFinder}
                       modifyFinder={modifyFinder}
                       removeFinder={removeFinder}
                       selectType={selectType}
                       selectFinder={selectFinder}
                       selectedFinder={selectedFinder}
            />
    );
};

const mapStateToProps = state => {
    return state;
};

const mapDispatchToProps = dispatch => {
    return {
        addFinder: (typeIndex, finderInfo) => dispatch(sdlAddFinderToType(typeIndex, finderInfo)),
        modifyFinder: (typeIndex, finderIndex, finderInfo) => dispatch(sdlModifyFinderOfType(typeIndex, finderIndex, finderInfo)),
        removeFinder: (typeIndex, finderIndex) => dispatch(sdlRemoveFinderFromType(typeIndex, finderIndex)),
        selectType: typeName => dispatch(sdlSelectType(typeName)),
        selectFinder: finderName => dispatch(sdlSelectFinder(finderName))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(DefineFinderContainer);
