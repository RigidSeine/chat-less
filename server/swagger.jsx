// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// module.exports = (app) => {
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// }

//Run using `npm run swagger` to auto-generate a Swagger document.
//Should only be used to start a new document. Updates should be manual :(

const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'Chat Less API',
        description: 'Forget websockets, interact with Chat Less using HTTP requests instead.'
    },
    host: 'localhost:4000',
    basePath: "/api/v1/",
    schemes: ['http', 'https'],
};

const outputFile = 'swagger.json';
const routes = ['./routes/messages.jsx'];

swaggerAutogen(outputFile, routes, doc);