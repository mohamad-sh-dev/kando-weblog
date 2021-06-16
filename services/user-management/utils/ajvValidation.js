const ajv = require('ajv');
const Ajv = new ajv();

const createValidateWithAjv = (schema ,object) => {
  const validate = Ajv.compile(schema);
  const valid = validate(object);
  //console.log(valid);
  return {
    errors: validate.errors,
    isValid: valid
  };
};

module.exports = {
  createValidateWithAjv
};