import React from 'react';
import {connect} from 'react-redux';
import ApolloProvider from 'react-apollo/ApolloProvider';
import StepperComponent from './StepperComponent';
import ApolloClient from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

const client = props => {
    const link = new HttpLink({
        uri: '/modules/graphql'
    });

    return new ApolloClient({
        link: link,
        cache: new InMemoryCache()
    });
};

const StepperComponentContainer = ({nodeTypes}) => (
    <ApolloProvider client={client()}>
        <StepperComponent nodeTypes={nodeTypes}/>
    </ApolloProvider>
);

const mapStateToProps = state => {
    return state;
};

export default connect(mapStateToProps)(StepperComponentContainer);
