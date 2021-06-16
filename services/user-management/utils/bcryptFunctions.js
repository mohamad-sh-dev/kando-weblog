const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password , 12);
}

exports.comparePassword = async (enteredPassword , userPassword)=>{
    return await bcrypt.compare(enteredPassword , userPassword);
}