const upperCaseFirst = val => {
    return val.substr(0, 1).toUpperCase().concat(val.substr(1));
};

export {
    upperCaseFirst
}