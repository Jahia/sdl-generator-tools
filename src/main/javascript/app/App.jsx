import React from 'react';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import {Provider} from 'react-redux';
import store from './App.redux-store';
import MainLayout from './layout/MainLayout';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/es/styles';

import {dsGenericTheme as theme} from '@jahia/ds-mui-theme';

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
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <I18nextProvider i18n={i18next}>
                    <MainLayout/>
                </I18nextProvider>
            </Provider>
        </MuiThemeProvider>
    );

};

export default App;
