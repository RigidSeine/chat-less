// server/services/mongodb-save-message.jsx

const sanitiser = require('../utils/sanitise-string.jsx');
const msgClient = require('./mongodb-create-ypl-client.jsx');

async function mongodbSaveMessage(message, username, room, createdTime){
    
    const client = msgClient();
    const sanitisedMessage = sanitiser(message);
    
    try{
        await client.connect();

        const db = client.db('YAP_LESS');
        const collection = db.collection('YPL_MESSAGE');
        
        const result = await collection.insertOne({
            message: sanitisedMessage,
            username: username,
            room: room,
            createdTime: createdTime
        });

    } catch (err){
        console.error('Error inserting document during save-message: ', err);
    } finally {
        await client.close();
    }
};

module.exports = mongodbSaveMessage;