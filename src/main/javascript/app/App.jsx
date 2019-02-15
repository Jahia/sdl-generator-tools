import React from 'react';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import {Provider} from 'react-redux';
import store from './App.redux-store';
import MainLayout from './layout/MainLayout';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/es/styles';

const THEME = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: 'Nunito Sans, Helvetica, Arial, sans-serif',
        fontSize: 14,
        fontWeight: 600
    }
});

const App = () => {
    i18next
        .use(XHR)
        .init({
            interpolation: {escapeValue: false},
            lng: 'en',
            load: 'languageOnly',
            fallbackLng: 'en',
            // resources: {
            //     en: {
            //         translation: {
            //             label: {
            //                 sdlGeneratorTools: {
            //                     top: {
            //                         caption: 'SDL Generator Tools',
            //                         backToTools: 'Back to tools'
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // },
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json',
            }
        });

    return (
        <MuiThemeProvider theme={THEME}>
            <Provider store={store}>
                <I18nextProvider i18n={i18next}>
                    <MainLayout/>
                </I18nextProvider>
            </Provider>
        </MuiThemeProvider>
    );
};

export default App;
