const captcha = require("svg-captcha");
const {
    createCaptchaToken,
    toBase64
} = require("./createToken");
const redisDb = require("../db/redisDb");
const captchaOption = {
    size: 6,
    noise: 2,
    color: true
}

// Create Captcha Use svg-captcha And Save it With Token In Redis
exports.createCaptcha = async () => {
    try {
        const cap = captcha.create(captchaOption)
        const token = createCaptchaToken()
        // Save To Redis (Key/Value) For 10 Minutes
        await redisDb.setex(token, 10 * 60, cap.text)
        // Return Image Data And Token As On Object For Send To The Client
        return {
            image: `data:image/svg+xml;base64,${toBase64(cap.data)}`,
            token
        }
    } catch (err) {
        console.log("this is from createCaptcha ", err);
        throw new Error(err)
    }
}

// Check Captcha Receive Token And Value From User 
exports.checkCaptcha = async (token , enteredValue) => {
    try {
        const value = await redisDb.get(token)
        // Value Is True 
        if(enteredValue === value){
            return await redisDb.delete(token)
        } else{
            // No Value For Token   Expired Or Not True Token  
            throw new Error("invalidCaptcha") ;
        }
    } catch (err) {
        throw err ;
    }
}