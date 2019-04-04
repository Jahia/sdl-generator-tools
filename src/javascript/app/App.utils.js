/* eslint-disable */
const generateUUID = () => {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};
/* eslint-disable */

const storeLocally = (key, jsonValue) => {
    window.localStorage.setItem(key, JSON.stringify(jsonValue));
};

const getFromLocalStore = key => {
    return JSON.parse(window.localStorage.getItem(key));
};

export {
    generateUUID,
    storeLocally,
    getFromLocalStore
};
