const captcha = require("../utils/captcha")

let message ; 
// Generate New Captcha With svj-captcha module 
exports.generate = async (req, res) => {
    try {
        const c = await captcha.createCaptcha()
        res.send(c)
    } catch (err) {
        console.log(err);
        message = "There Is A Problem Try Later"
        res.send("fail" , 400 , message)
    }

}

// Check Captcah Handdler
exports.checkCaptcha = async (req, res) => {
    try {
        // Recive Token And Value From Client
        const {
            captchaToken , 
            captchaValue
        } = req.body
        // Check If True And Send Response 
        await captcha.checkCaptcha(captchaToken, captchaValue)
        message = "true"
        res.send("success" , 200 , message )

    } catch (err) {
        console.log(err.message);
        //Handdle Err responses
        if(err.message === "invalidCaptcha"){
            message = "invalidCaptcha"
            res.send("fail" , 400 , message)
        }else{
            message = "There Is Problem Try Later"
            res.send("fail" , 500 , message)
        }
    }

}