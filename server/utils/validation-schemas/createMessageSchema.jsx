const yup =  require('yup');
const pattern_matching = require('../pattern-matching.jsx')

exports.createMessageSchema = yup
    .object()
    .shape({
        message: yup
                    .string()
                    .max(4000)
                    .required()

        ,room: yup
                .string()
                .lowercase()
                .max(30)
                .oneOf(['javascript', 'node', 'express', 'react']) //Replace list with getter function for list
                .required()
        
        ,username: yup
                    .string()
                    .max(30)
                    .required()

    })
    .exact();
