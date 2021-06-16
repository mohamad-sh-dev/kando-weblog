const Ajv = require("ajv");
const ajv = new Ajv({
    $data: true,
})

// add new format to userSchema
const dateTimeRegex = new RegExp(`"([0-9]+(-[0-9]+)+)"`);
ajv.addFormat("date-time", {
    validate: (dateTimeString) => dateTimeRegex.test(dateTimeString)
})

const emailRegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
ajv.addFormat("email", {
    validate: (email) => emailRegExp.test(email)
})

const userSchema = {
    type: "object",
    properties: {
        firstname: {
            type: "string",
            minLength: 2,
        },
        lastname: {
            type: "string",
            minLength: 2
        },
        email: {
            type: "string",
            format: "email"
        },
        password: {
            type: "string",
            minLength: 4
        },
        passwordConfirm: {
            type : "string" , 
            const:{ "$data" : "/password"} ,
        },
        isActive: {
            type: "boolean",
        },
        signupAt: {
            type: "string",
            format: "date-time"
        },
        role: {
            type: "string",
            enum: ["admin", "bloger"]
        }
        // isActive:{
        //     type : boolean, // this property set in database(mysql) for each user as default (true) so we dont need define here in our schema 
        // } 

    },
    required: ["firstname", "lastname", "email", "password" , "passwordConfirm" , "signupAt"],
    additionalProperties: false
}

// compile schema and return value true/false    if false return errors array 
const createValidateWithAjv = (schema, object) => {
    console.log(object);
    const validate = ajv.compile(schema);
    const valid = validate(object);
    return {
        errors: validate.errors,
        isValid: valid
    };
};

module.exports = {
    userSchema,
    createValidateWithAjv
};