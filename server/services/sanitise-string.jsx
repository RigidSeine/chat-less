//./server/services/sanitise-string.jsx

function sanitiseString(str) {
    if (!str) return;
    
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}

module.exports = sanitiseString;