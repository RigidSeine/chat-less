//./server/services/mongodb-get-messages.jsx

const msgClient = require('./mongodb-create-ypl-client.jsx');

async function mongodbGetMessages(room){
    const client = msgClient();

    //Creating constants to paramterise the query
    const query = {room: room};
    const projection = {
        username: 1,
        message: 1,
        room: 1,
        createdTime: 1
    };
    const sortOrder = {createdDate: -1};
    const recordLimit = 100;

    try{
        await client.connect();

        const db = client.db('YAP_LESS');
        const collection = db.collection('YPL_MESSAGE');

        const findResultsCursor = collection.find(query)
        .sort(sortOrder)
        .project(projection)
        .limit(recordLimit);

        for await (const doc of findResultsCursor){
            console.log(doc);
        }

    } catch (err) {
        console.error('Error encountered trying to retrieve messages: ', err);
    } finally {
        await client.close();
    };

};

module.exports = mongodbGetMessages;