//From https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object

function isObjectEmpty(obj) {
    for (var i in obj) { return true; } 
    
    return false;
};

function hasOnlyNullPropertyValues(obj) {
    for (var i in obj) {
        if (obj[i] !== null) return false;
    }

    return true;
}

module.exports = {isObjectEmpty, hasOnlyNullPropertyValues};