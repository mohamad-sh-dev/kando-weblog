const bcrypt = require("bcrypt")

exports.comparePassword = async (enteredPassword , userPassword)=>{
    return await bcrypt.compare(enteredPassword , userPassword);
}