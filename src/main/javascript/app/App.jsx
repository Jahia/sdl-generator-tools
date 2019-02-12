import React from 'react';
import styles from './App.css';
import {Provider} from 'react-redux';
import store from './App.redux-store';

const App = () => (
    <Provider store={store}>
        <div className={styles.container}>Something amazing is coming up ... &copy; Chooli Yip</div>
    </Provider>
);

export default App;
