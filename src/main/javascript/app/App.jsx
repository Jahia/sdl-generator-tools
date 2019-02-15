import React from 'react';
import {Provider} from 'react-redux';
import store from './App.redux-store';
import MainLayout from './layout/MainLayout';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/es/styles';
import {dsGenericTheme as theme} from '@jahia/ds-mui-theme';

const App = () => (
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <MainLayout/>
        </Provider>
    </MuiThemeProvider>
);

export default App;
