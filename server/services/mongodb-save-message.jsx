// server/services/mongodb-save-message.jsx

const {MongoClient, ServerApiVersion} = require('mongodb');
const sanitiser = require('./sanitise-string.jsx');

const createMongoClient = () => {
    //Always URI encode the username and password using the 
    //encodeURIComponent method to ensure they are correctly parsed.
    const dbUsername = encodeURIComponent(process.env.MDB_USERNAME);
    const dbPassword = encodeURIComponent(process.env.MDB_PW);
    const clusterUrl =  process.env.MDB_CLUSTER_NAME;
    const authMechanism = "DEFAULT";

    const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${clusterUrl}/?authMechanism=${authMechanism}`;

    return new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
};

async function mongodbSaveMessage(message, username, room, createdTime){
    
    const client = createMongoClient();
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

        console.log('Inserted 1 document woth _id:' + result.insertedId);
    } catch (err){
        console.error('Error inserting document during save-message: ', err);
    } finally {
        await client.close();
    }
};

module.exports = mongodbSaveMessage;