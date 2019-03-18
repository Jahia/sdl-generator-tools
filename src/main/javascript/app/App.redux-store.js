import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {batchDispatchMiddleware} from 'redux-batched-actions';
import {nodeTypesReducer} from './App.redux-reducer';
import {selectedPropertyReducer, selectedFinderReducer, selectionReducer, addModifyPropertyDialog, addModifyTypeDialog, addModifyFinderDialog} from './StepperComponent/StepperComponent.redux-reducer';

const rootReducer = combineReducers({
    nodeTypes: nodeTypesReducer,
    selection: selectionReducer,
    selectedProperty: selectedPropertyReducer,
    selectedFinder: selectedFinderReducer,
    addModifyPropertyDialog: addModifyPropertyDialog,
    addModifyTypeDialog: addModifyTypeDialog,
    addModifyFinderDialog: addModifyFinderDialog
});

const composeEnhancers = window.top.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            batchDispatchMiddleware
        ),
    ),
);

export default store;
