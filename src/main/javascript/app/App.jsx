import React from 'react';
import {Provider} from 'react-redux';
import store from './App.redux-store';
import MainLayout from './layout/MainLayout';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/es/styles';

const THEME = createMuiTheme({
    typography: {
        useNextVariants: true,
        "fontFamily": "\"Nunito Sans\", \"Helvetica\", \"Arial\", sans-serif",
        "fontSize": 14,
        "fontWeight": 600
    }
});

const App = () => (
    <MuiThemeProvider theme={THEME}>
        <Provider store={store}>
            <MainLayout/>
        </Provider>
    </MuiThemeProvider>
);

export default App;
