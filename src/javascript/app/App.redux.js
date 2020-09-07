import {combineReducers} from 'redux';
import {nodeTypesReducer} from './App.redux-reducer';
import {
    addModifyFinderDialog,
    addModifyPropertyDialog,
    addModifyTypeDialog,
    selectedFinderReducer,
    selectedPropertyReducer,
    selectionReducer
} from './MainLayout/StepperComponent/StepperComponent.redux-reducer';

export const sdlRedux = registry => {
    const rootReducer = combineReducers({
        nodeTypes: nodeTypesReducer,
        selection: selectionReducer,
        selectedProperty: selectedPropertyReducer,
        selectedFinder: selectedFinderReducer,
        addModifyPropertyDialog: addModifyPropertyDialog,
        addModifyTypeDialog: addModifyTypeDialog,
        addModifyFinderDialog: addModifyFinderDialog
    });

    registry.add('redux-reducer', 'sdlGeneratorTools', {targets: ['root'], reducer: rootReducer});
};
