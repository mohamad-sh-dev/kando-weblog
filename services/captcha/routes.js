const captchControoler = require("./controller/captchaHanddler")
const dataParser = require("kando-dataparser")

module.exports = {
    "/api/v1/captcha/generate": {
        "GET": {
            function: captchControoler.generate,
            middlewares: []
        },
    },
    "/api/v1/captcha/check": {
        "POST": {
            function: captchControoler.checkCaptcha,
            middlewares: [dataParser]
        },
    },
    
}