// <3 https://github.com/i18next/react-i18next/blob/master/example/test-jest/__mocks__/react-i18next.js

const React = require('react');
const reactI18next = require('react-i18next');

const hasChildren = node => node && (node.children || (node.props && node.props.children));

const getChildren = node =>
    node && node.children ? node.children : node.props && node.props.children;

const renderNodes = (children, components) => {
    let reactNodes = children || components;
    if (typeof reactNodes === 'string') {
        return reactNodes;
    }

    return Object.keys(reactNodes).map((key, i) => {
        const child = reactNodes[key];
        const isElement = React.isValidElement(child);

        if (typeof child === 'string') {
            return child;
        } if (hasChildren(child)) {
            const inner = renderNodes(getChildren(child));
            return React.cloneElement(
                child,
                { ...child.props, key: i },
                inner,
            );
        } else if (typeof child === 'object' && !isElement) {
            return Object.keys(child).reduce((str, childKey) => `${str}${child[childKey]}`, '');
        }

        return child;
    });
};

module.exports = {
    // This mock makes sure any components using the translate HoC receive the t function as a prop
    withNamespaces: () => Component => props => <Component t={k => k} {...props} />,
    translate: () => Component => props => <Component t={k => k} {...props} />,
    Trans: ({ children, components }) => renderNodes(children, components),
    NamespacesConsumer: ({ children }) => children(k => k, { i18n: {} }),

    // Mock if needed
    Interpolate: reactI18next.Interpolate,
    I18nextProvider: reactI18next.I18nextProvider,
    loadNamespaces: reactI18next.loadNamespaces,
    reactI18nextModule: reactI18next.reactI18nextModule,
    setDefaults: reactI18next.setDefaults,
    getDefaults: reactI18next.getDefaults,
    setI18n: reactI18next.setI18n,
    getI18n: reactI18next.getI18n,
};