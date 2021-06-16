const crypto = require("crypto") ; 

// Create A Random Token For Specific Value Use Crypto Module
const createCaptchaToken = ()=>{
    return crypto.randomBytes(10).toString("hex")
}
// Handdle Image Data For Browser Parser
const toBase64 = (string)=>{
    return Buffer.from(string).toString("base64");
}

module.exports = {
    createCaptchaToken,
    toBase64
}