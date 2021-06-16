const User = require("../model/userModel");
const {
    sendStatusCodeAndSetHeader
} = require("kando-utils")
const jwt = require("jsonwebtoken")
const axios = require("axios");
const msgConfig = require("../config/msgConfig")

exports.protect = async (req, res, next) => {
    try {
        let token;
        let message;
        // Check token from request
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        // if token not exist return false
        if (!token || token === "null") {
            message = msgConfig.unauthorizeMsgs._NotEntered
            sendStatusCodeAndSetHeader(res, msgConfig.badRequestesMsgs._failMsg,
                msgConfig.unauthorizeMsgs._unauthorizeStatusCode, message, null)
            return;
        }
        // verify token with our SECRET_KEY
        const decoded = jwt.verify(token, process.env._JWT_SECRET_KEY)
        // Token verifyed and find user with our User model methods 
        const currentUser = await new User().getUserById(decoded.payload)
        //if token expired or user no longer exist return false 
        if (currentUser.data.length <= 0) {
            message = msgConfig.unauthorizeMsgs._expireTokenOrNoExist
            sendStatusCodeAndSetHeader(res, msgConfig.badRequestesMsgs._failMsg,
                msgConfig.unauthorizeMsgs._unauthorizeStatusCode, message, null)
            return;
        }
        // get access if all conditions true and set req.user to current user for access in whole application functions
        delete currentUser.data[0].password
        delete currentUser.data[0].signupAt
        req.user = currentUser.data;
        next()
    } catch (err) {
        console.log("THIS IS FROM PROTECTGETUSERS MIDDLEWARE CATCH ERR", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
    }
}


exports.checkAccess = async (req, res, next) => {
    let message;
    const AcUrl = "http://localhost:8080/accesscontroll/api/v1/getPermision"
    const {
        method,
        url,
        user
    } = req;
    await axios({
        method: 'post',
        url: AcUrl,
        headers: {
            authorization: req.headers.authorization
        },
        data: {
            method,
            url,
            user
        }
    }).then(result => {
        console.log("Check Access Middleware", result.data);
        next()
    }).catch(err => {
        console.log("THIS IS FROM CHECKACCESSUSER MIDDLEWARE", err.response);
        if (err.response.data.status === "not found") {
            message = err.response.data.response;
            return res.send(err.response.data.status, msgConfig.notFoundMsgs._notFoundStatusCode,
                message)
        }
        message = msgConfig.forbiddenMsgs._forbiddenMsg
        console.log("ERROR", err.response.data);
        return res.send(msgConfig.badRequestesMsgs._failMsg,
            msgConfig.forbiddenMsgs._forbiddenStatusCode, message)
    })

}