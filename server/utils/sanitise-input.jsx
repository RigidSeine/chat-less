//./server/utils/sanitise-string.jsx

function sanitiseString(str) {
    if (!str) return;
    
    //Remove characters not in this set
    str = str.replace(/[^a-z0-9āēīōūáéíóúñü \.,_-]/gim,"");

    return str.trim();
}

module.exports = sanitiseString;