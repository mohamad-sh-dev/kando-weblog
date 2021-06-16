const Ajv = require("ajv");
const ajv = new Ajv()

// add new format to postSchema
const dateTimeRegex = new RegExp(`"([0-9]+(-[0-9]+)+)"`);
ajv.addFormat("date-time", {
    validate: (dateTimeString) => dateTimeRegex.test(dateTimeString)
})

const blogSchema = {
    type: "object",
    properties: {
        title: {
            type: "string"
        },
        userId:{
            type: "integer"
        },
        postId:{
            type:"integer"
        },     
        createdAt: {
            type: "string",
            format: "date-time"
        },
        isActive:{
            type : "boolean"
        }
    },
    required: [], // we dont ser required any property cuz of need entered manually (for blogs table)
    additionalProperties: false
}

module.exports = {
    blogSchema,
    createValidateWithAjv
};