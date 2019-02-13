import React from 'react';
import {Provider} from 'react-redux';
import store from './App.redux-store';
import { BrowserRouter as Router, Link } from "react-router-dom";
import MainLayout from './layout/MainLayout'

const App = () => (
    <Router>
        <Provider store={store}>
                <MainLayout />
        </Provider>
    </Router>
);

export default App;
