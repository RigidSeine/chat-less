//./server/services/mongodb-get-messages.jsx

const msgClient = require('./mongodb-create-ypl-client.jsx');
const logger = require('../utils/winston-logger.jsx');


/* JS does not natively support overloading functions
Therefore we'll need to work around it by having the MongoDB query (WHERE condition)
supplied as an argument to the function.
*/

async function mongodbGetMessages(query){
    const client = msgClient();

    logger.info('Get Messages Client: ' + client);

    logger.info('Query: ' + JSON.stringify(query));

    //Creating constants to paramterise the query
    const projection = {
        username: 1,
        message: 1,
        room: 1,
        createdTime: 1
    };
    const sortOrder = {createdTime: -1};
    const recordLimit = 100;

    logger.info('Message query created.');

    try{
        await client.connect();

        const db = client.db('YAP_LESS');
        const collection = db.collection('YPL_MESSAGE');

        const findResultsCursor = await collection.find(query)
        .sort(sortOrder)
        .project(projection)
        .limit(recordLimit);

        const resultsArray = await findResultsCursor.toArray();

        await logger.info(resultsArray[0]);

        //Return the results as an array to append it to the messagesReceived state array later
        //toArray needs to be awaited as well otherwise it'll run synchronously before the query is complete
        return resultsArray;

    } catch (err) {
        console.error('Error encountered trying to retrieve messages: ', err);
    } finally {
        await client.close();
    };

};

module.exports = mongodbGetMessages;