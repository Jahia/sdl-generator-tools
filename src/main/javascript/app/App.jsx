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

// TODO remove / integrate in the theme
delete theme.overrides.MuiInput.underline['&:hover'];
theme.overrides.MuiInput.underline['&:hover:not($disabled):after'] = {borderBottom: '1px solid #007cb0'};
theme.overrides.MuiInput.underline['&:hover:not($disabled):before'] = {borderBottom: '1px solid #007cb0'};
theme.overrides.MuiInput.disabled['& input'].color = theme.palette.font.gamma;

const App = ({dxContext}) => (
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <I18nextProvider i18n={getI18n({
                lng: 'en',
                ns: [defaultNamespace],
                contextPath: dxContext.contextPath,
                defaultNS: defaultNamespace,
                namespaceResolvers: {
                    defaultNamespace: lang => require('../../resources/javascript/locales/' + lang + '.json')
                }
            })}
            >
                <ApolloProvider client={client({
                    contextPath: dxContext.contextPath,
                    useBatch: true,
                    httpOptions: {batchMax: 10}
                })}>
                    <MainLayout contextPath={dxContext.contextPath}/>
                </ApolloProvider>
            </I18nextProvider>
        </Provider>
    </MuiThemeProvider>
);

export default App;
