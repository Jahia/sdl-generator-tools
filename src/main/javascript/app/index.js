import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.sdlGeneratorToolsReactRender = function (target, dxContext) {
    ReactDOM.render(<App dxContext={dxContext}/>, document.getElementById(target));
};
