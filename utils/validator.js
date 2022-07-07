const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
};

const validateObject = (obj) => {
    const newObj = obj;
    const errors = {};
    Object.entries(newObj).forEach(item => {
        if(isEmpty(item[1].toString()))
            errors[item[0]] = "cannot be empty";
    });
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
}

module.exports = { validateObject, isEmpty }