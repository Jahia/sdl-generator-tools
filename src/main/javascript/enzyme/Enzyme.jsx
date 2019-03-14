import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {MuiThemeProvider} from '@material-ui/core';
import {dsGenericTheme as theme} from '@jahia/ds-mui-theme';

configure({ adapter: new Adapter() });

const shallowWithTheme = (children, options) => {
    const wrapper = shallow(<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>, options);
    const instance = wrapper.instance();
    return wrapper.shallow({ context: instance.getChildContext() })
};

export { shallow, mount, render, shallowWithTheme };

export default Enzyme;