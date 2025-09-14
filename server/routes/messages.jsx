const express = require('express');
const mongodbSaveMessage = require ('../services/mongodb-save-message.jsx');
const mongodbGetMessages = require ('../services/mongodb-get-messages.jsx');
const logger = require('../utils/winston-logger.jsx');
const sanitiser = require('../utils/sanitise-input.jsx');
const { ObjectId } = require('mongodb');
const { queryMessageSchema } = require('../utils/validation-schemas/queryMessageSchema.jsx');
const { createMessageSchema } = require('../utils/validation-schemas/createMessageSchema.jsx');
const objectUtils = require('../utils/object-utilities.jsx');

const router = express.Router();

/************  REST API *****************/
const api_endpoint_prefix = '/api/v1/';

//Set up a new API endpoint called status and return a JSON response.
router.get(api_endpoint_prefix + 'Rise', (request, response) => {
    const rise = {
        'Rise' : '🐐'
    };
    response.status(200).send(rise);
});

// GET /messages?id&username - V1 - Get a message using a message ID and/or a username
router.get(api_endpoint_prefix + 'messages', (request, response) => {

    //const id = sanitiser.sanitiseString(request.query.id);
    //const validatedId = queryMessageSchema.validateSync(id, { abortEarly: true, stripUnknown: true});

    logger.info('Start GET /messages.');

    const input = sanitiser.santiseObject(request.query);
    
    try {
        logger.info(JSON.stringify(input));
        const validatedInput = queryMessageSchema.validateSync(input, {});
        
        logger.info('Validation complete.');

        var inputQuery = {};

        //Creating ObjectId is required for searching via MongoDB IDs
        if (validatedInput.id) { inputQuery._id = ObjectId.createFromHexString(validatedInput.id); }
        if (validatedInput.username) { inputQuery.username = validatedInput.username; }

        //Retrieve no results if no parameters are passed in.
        if (objectUtils.hasOnlyNullPropertyValues(inputQuery)){
            inputQuery._id = -1;
        }
        
        mongodbGetMessages(inputQuery)
        .then((message) => {
            if (message.length == 0) {
                response.status(404).json({Error : 'No message found.'});
            } else {
                response.status(200).json(message);
            }
        })
        .catch((err) =>  { 
            logger.error('Error encountered trying to retrieve messages during explicit GET request: ', err);
            response.status(500).json({ Error : `Unable to retrieve messages during ID GET request. ${err}` });
        });        
    }
    catch (error) {
        logger.error(error.toString());
        return response.status(422).json({errors: error.errors});
    }
    finally {
        logger.info("GET messages complete.");
    }

});

// POST /messages - V1 - Send a message using a request
router.post(api_endpoint_prefix + 'messages', (request, response) => {

    logger.info('Start POST /messages.');

    const body = sanitiser.santiseObject(request.body);

    logger.info('POST /Messages Request received and sanitised', { body });

    try {
        const data = createMessageSchema.validateSync(body);

        mongodbSaveMessage(data.message, data.username, data.room, Date.now())
        .then(() => response.status(201).json({message: 'Message sent.'}))
        .catch((err) => {
            logger.error(`Error encountered trying to send a message during POST request. ${err}`);
            response.status(500).json({Error: `Internal server error encountered. Whoops! ${err}` });
        })
    } 
    catch (error) {
        logger.error(error.toString());
        return response.status(422).json({errors: error.errors});
    }
    finally {
        logger.info("POST messages complete.");
    }
});

module.exports = router;