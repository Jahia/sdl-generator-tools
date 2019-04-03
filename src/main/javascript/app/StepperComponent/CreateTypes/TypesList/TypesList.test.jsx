import React from 'react';
import {shallow, shallowWithTheme} from '../../../../enzyme/Enzyme';
import TypeList from './';
import {Typography} from '@jahia/ds-mui-theme';
import configureStore from 'redux-mock-store';
import C from '../../../App.constants';

describe('TypeList tests', () => {
    let mockStore = configureStore();

    test('Test empty list in mode create', () => {
        const store = mockStore(initialState);
        const wrapper = shallowWithTheme(<TypeList store={store} mode={C.TYPE_LIST_MODE_CREATE}/>);
        expect(wrapper.dive().dive().dive().contains(
            <Typography color="alpha" variant="zeta">label.sdlGeneratorTools.createTypes.addNewTypeButton</Typography>
        )).toBe(true);
    });

    test('Test empty list in mode display', () => {
        const store = mockStore(initialState);
        const wrapper = shallowWithTheme(<TypeList store={store} mode={C.TYPE_LIST_MODE_DISPLAY}/>);
        expect(wrapper.dive().dive().dive().contains(
            <Typography color="alpha" variant="zeta">label.sdlGeneratorTools.createTypes.addNewTypeButton</Typography>
        )).toBe(false);
    });

    test('Test list with one selected item', () => {
        const store = mockStore(stateWithOneSelectedItem);
        let wrapper = shallowWithTheme(<TypeList store={store} mode={C.TYPE_LIST_MODE_CREATE}/>);
        wrapper = wrapper.dive().dive().dive();
        expect(wrapper.contains(
            <Typography color="alpha" variant="zeta">label.sdlGeneratorTools.createTypes.addNewTypeButton</Typography>
        )).toBe(true);
        expect(wrapper.find('[uuid="46e237d9-c125-48c0-a9f8-3c380da7d03b"]')).toBeDefined();
    });

    // Test('Test empty mode create', () => {
    //     const store = mockStore(initialState);
    //     // const wrapper = shallow(<li><p className={"myClass"}>My item</p></li>);
    //     const wrapper = shallowWithTheme(<TypeList store={store} mode={C.TYPE_LIST_MODE_CREATE}/>);
    //     // console.log(wrapper.dive().dive().dive().text());
    //     console.log(wrapper.dive().dive().dive().debug());
    //     console.log(wrapper.dive().dive().dive().find('DsTypography[color="alpha"]').text());
    //     // console.log(wrapper.find('.myClass').get(0));
    //     // expect(wrapper.find('.myClass').get(0)).toBeDefined();
    //     expect(wrapper.dive().dive().dive().find('DsTypography[color="alpha"]')).toBeDefined();
    // })
});

const initialState = {
    nodeTypes: {},
    selection: null,
    selectedProperty: null,
    selectedFinder: null
};

const stateWithOneSelectedItem = {
    nodeTypes: {
        '46e237d9-c125-48c0-a9f8-3c380da7d03b': {
            name: 'Article',
            displayName: 'Article (title and introduction)',
            description: null,
            queries: [],
            fieldDefinitions: [],
            directives: [
                {
                    name: 'mapping',
                    arguments: [
                        {
                            name: 'node',
                            value: 'jnt:article'
                        }
                    ]
                }
            ]
        }
    },
    selection: '46e237d9-c125-48c0-a9f8-3c380da7d03b',
    selectedProperty: null,
    selectedFinder: null
};
