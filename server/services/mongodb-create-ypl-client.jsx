const {MongoClient, ServerApiVersion} = require('mongodb');
const logger = require('../utils/winston-logger.jsx');

require('dotenv').config();

const createYapLessClient = () => {
    //Always URI encode the username and password using the 
    //encodeURIComponent method to ensure they are correctly parsed.
    const dbUsername = encodeURIComponent(process.env.MDB_USERNAME);
    const dbPassword = encodeURIComponent(process.env.MDB_PW);
    const clusterUrl =  process.env.MDB_CLUSTER_NAME;
    const authMechanism = "DEFAULT";

    const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${clusterUrl}/?authMechanism=${authMechanism}`;

    logger.info('Chat Less Client created.');

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        connectTimeoutMS: 10000
    });
    
    logger.info('Create Client client: ' + client);

    return client;
};

module.exports = createYapLessClient;