const Ajv = require("ajv");
const ajv = new Ajv()

// add new format to postSchema
const dateTimeRegex = new RegExp(`"([0-9]+(-[0-9]+)+)"`);
ajv.addFormat("date-time", {
    validate: (dateTimeString) => dateTimeRegex.test(dateTimeString)
})
const persianHastagRegex = new RegExp(/^#([\u0600-\u06FF]+\s?)+$/);
ajv.addFormat("hashtag", {
    validate: (hastag) => persianHastagRegex.test(hastag)
})

const postSchema = {
    type: "object",
    properties: {
        title: {
            type: "string" ,
            minLength : 3
        },
        blogId:{
            type: "integer"
        },
        body:{
            type:"string" ,
            minLength : 10
        },
        createdAt: {
            type: "string",
            format: "date-time"
        },
        category:{
            type : "string",
            default : "پیش فرض"
        },
        tag:{
            type: "string",
           format : "hashtag"
        }
    },
    required: ["title" ,"body" , "tag" ], // we dont ser required any property cuz of need entered manually (for blogs table)
    additionalProperties: false
}

const createValidateWithAjv = (schema, object) => {
    const validate = ajv.compile(schema);
    const valid = validate(object);
    return {
        errors: validate.errors,
        isValid: valid
    };
};

module.exports = {
    postSchema ,
    createValidateWithAjv
};