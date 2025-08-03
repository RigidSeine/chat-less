//./server/utils/map-object.jsx

//Maps an object's keys AND values to a function by reading an object as key-value arrays
function mapObject(obj, fn) {
    return Object.fromEntries(
        Object.entries(obj).
            map(([key, value]) => {
                if (typeof value === 'object' &&
                    value !== null) {
                    return [fn(key), mapObject(value, fn)];
                }
                return [fn(key), fn(value)];
            })
    );
}

module.exports = mapObject