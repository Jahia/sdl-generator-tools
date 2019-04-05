const eslintConfig = require('@jahia/test-framework').eslintConfig;

eslintConfig.rules['react/jsx-fragments'] = ['ignore'];

module.exports = eslintConfig;
