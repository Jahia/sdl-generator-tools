import React from "react";
import styles from "./ToolsContainer.css";

class ToolsContainer extends React.Component{

    constructor(props){
        super(props);
    }

    render () {
        return <div className={styles.container}>Something amazing is coming up ...</div>
    }

}

export default ToolsContainer;