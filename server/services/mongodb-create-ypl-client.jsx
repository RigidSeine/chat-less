const {MongoClient, ServerApiVersion} = require('mongodb');

const createYapLessClient = () => {
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

module.exports = createYapLessClient;