import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {getI18n} from '@jahia/i18next';
import {Provider} from 'react-redux';
import store from './App.redux-store';
import MainLayout from './MainLayout';
import {MuiThemeProvider} from '@material-ui/core/es/styles';
import {dsGenericTheme as theme} from '@jahia/ds-mui-theme';
import ApolloProvider from 'react-apollo/ApolloProvider';
import {client} from '@jahia/apollo-dx';

const defaultNamespace = 'sdl-generator-tools';

const App = ({dxContext}) => (
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <I18nextProvider i18n={getI18n({
                lng: 'en',
                ns: [defaultNamespace],
                defaultNS: defaultNamespace,
                namespaceResolvers: {
                    defaultNamespace: lang => require('../../resources/javascript/locales/' + lang + '.json')
                }
            })}
            >
                <ApolloProvider client={client({
                    contextPath: dxContext.contextPath,
                    useBatch: true,
                    httpOptions: {batchMax: 50}
                })}
                >
                    <MainLayout/>
                </ApolloProvider>
            </I18nextProvider>
        </Provider>
    </MuiThemeProvider>
);

export default App;
