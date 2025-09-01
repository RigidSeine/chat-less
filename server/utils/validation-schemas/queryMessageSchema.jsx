const yup =  require('yup');
const pattern_matching = require('../pattern-matching.jsx')
const logger = require('../winston-logger.jsx')

exports.queryMessageSchema = yup
    .object()
    .shape({ //when() is required if all parameters are optional
        id: yup
            .string()
            .when('id', (value) => {

                    //Convert from object to string to make use of string functions
                    const val = value.toString().trim();

                    if(val && val?.length > 0) {

                        return yup
                                .string()
                                .test({
                            name: 'isObjectId',
                            exclusive: true,
                            test: function (value) { return pattern_matching.isObjectId(value);},
                            message: 'Not a valid object ID. Must be a 24 character hex string.'
                        });
                    } else {
                        return yup
                                .string()
                                .transform((value, originalValue) => {
                                    return !value ? null : originalValue;
                                });
                    }
            })
            .notRequired()
        
        ,username: yup
                    .string()
                    .notRequired()
    }, 
    [
        ['id', 'id']
    ])
    .exact('Unknown parameter found.')
    ;