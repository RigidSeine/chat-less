//./server/utils/sanitise-input.jsx

const mapObject = require('./map-object.jsx');
const logger = require('./winston-logger.jsx');

function sanitiseString(str) {
    if (!str) return;

    if (typeof(str) !== 'string') return str;
    
    //Remove characters not in this set
    str = str.replace(/[^a-z0-9āēīōūáéíóúñü \.,_-]/gim,"");

    return str.trim();
}

function santiseObject(obj) {
    logger.info('Sanitising object', { obj });

    if (typeof(obj) === 'object' && !!!Array.isArray(obj)) {
        return mapObject(obj, sanitiseString);
    }

    return obj;
}

module.exports = {sanitiseString, santiseObject};