const User = require("../model/userModel");
const userModel = new User()
const {
    createValidateWithAjv,
    userSchema
} = require("../schema/userSchema");
const {
    convertDate,
} = require("kando-utils")
const msgConfig = require("../config/msgConfig")
const {
    buildHumanErrors
} = require("../utils/inputErrors")
const axios = require("axios");

let message;

exports.checkCaptcha = async (req, res, next) => {
    try {
        const {
            captchaToken,
            captchaValue
        } = req.body
        if (!captchaToken || !captchaValue) {
            message = msgConfig.badRequestesMsgs._hasNoEnterCaptcha
            return res.send(msgConfig.badRequestesMsgs._failMsg, 
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        const result = await axios({
            method: "post",
            url: "http://localhost:8080/api/v1/captcha/check",
            data: {
                captchaToken,
                captchaValue
            }
        })
        if (result.data.status = "success") next();
    } catch (err) {
        console.log("this from middleware", err.response.data);
        message = msgConfig.badRequestesMsgs._invalidCaptcha
        if (err.response.data.response === "invalidCaptcha") {
            res.send(msgConfig.badRequestesMsgs._failMsg, 
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
    }

}

exports.checkEmail = async (req, res, next) => {
    try {
        const {
            email
        } = req.body
        // check for email no taken
        const checkEmail = await userModel.checkEmail(email)
        // if email take by another user
        if (checkEmail.data.length > 0) {
            message = msgConfig.badRequestesMsgs._email;
            return res.send(msgConfig.badRequestesMsgs._failMsg, 
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        next()
    } catch (err) {
        console.log("THIS IS FROM checkEmail MIDDLEWARE CATCH ERR", err);
        message = msgConfig.internalServerErr._internalServerErr
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
    }
}
exports.checkUser = async (req, res, next) => {
    try {
        const {
            userId,
            email
        } = req.body
        if (userId !== undefined) {
            let user = await userModel.getUserById(userId)
            if (user.data.length <= 0) {
                message = msgConfig.notFoundMsgs.noUserFoundWithIdMsg;
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message);
            }
            req.userId = user.data[0].userId
            next()
        } else if (email !== undefined) {
            let user = await userModel.checkEmail(email)
            if (user.data.length <= 0) {
                message = msgConfig.notFoundMsgs.noUserFoundWithEmailMsg;
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message);
            }
            req.userId = user.data[0].userId;
            next()
        }
    } catch (err) {
        console.log("THIS IS FROM checkEmail MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
    }
}

exports.schemaValidation = (req, res, next) => {
    try {
        const date = convertDate(new Date)
        const userObj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            signupAt: `"${date}"`,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        }
        // validation for schema 
        const valid = createValidateWithAjv(userSchema, userObj)
        // console.log(userObj);
        if (valid.isValid !== true) {
            buildHumanErrors(valid.errors)
            console.log(valid.errors[0].params);
            return res.send(msgConfig.badRequestesMsgs._failMsg, 
                msgConfig.badRequestesMsgs._badRequestStatusCode, valid.errors[0].message)
        }
        // no err then next 
        req.body.signupAt = date
        next()
    } catch (err) {
        console.log("THIS IS FROM userSchemaValidation MIDDLEWARE CATCH ERR", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
    }

}