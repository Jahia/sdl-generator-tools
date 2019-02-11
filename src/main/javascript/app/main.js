import React from "react";
import ReactDOM from "react-dom";
import ToolsContainer from "./ToolsContainer";

window.sdlGeneratorToolsReactRender = function (target, dxContext) {
    ReactDOM.render(<ToolsContainer dxContext={dxContext}/>, document.getElementById(target));
};