function isObjectId (id) {
    
    if (!id) return false;

    //Match for a 24 character hex string 
    //A positive match will return an array while an negative match will return null
    return (id.match(/^[0-9a-fA-F]{24}$/) !== null);
};

module.exports = {isObjectId};