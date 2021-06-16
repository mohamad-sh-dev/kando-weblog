const axios = require("axios")
const AC = require("../model/acceessModel")
const ac = new AC()

const msgConfig = require("../config/msgConfig")
const {
    sendStatusCodeAndSetHeader
} = require("kando-utils")
const jwt = require("jsonwebtoken");

exports.urlParser = (req, res, next) => {
    try {
        let unparsedUrl = req.body.url
        if (unparsedUrl.includes("/db")) {
            req.body.url = unparsedUrl.split("?")[0]
        } else if (unparsedUrl.includes("?")) {
            req.body.url = unparsedUrl.split("?")[0]
        }
        next()
    } catch (err) {
        console.log("THIS IS FROM URLPARSER(ACMANAGER) MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.checkAccess = async (req, res, next) => {
    try {
        let message;
        const AcUrl = "http://localhost:8080/accesscontroll/api/v1/getPermision"
        const {
            method,
            url,
            user,
            ownerPassword = method ==="POST" || "DELETE" || "PUT" ?
             req.body.ownerPassword : req.query.ownerPassword
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
                user,
                ownerPassword
            }
        }).then(result => {
            console.log("Check Access Middleware (AcManager) ", result.data);
            next()
        }).catch(err => {
            if (err.response.data.status === "not found") {
                message = err.response.data.response;
                return res.send(err.response.data.status, msgConfig.notFoundMsgs._notFoundStatusCode, message)
            } else if (err.response.data.status === "fail") {
                message = err.response.data.response;
                return res.send(err.response.data.status, err.response.status, message)
            }
            message = "دسترسی به این بخش برای شما مقدور نمیباشد";
            console.log("ERROR", err.response.data);
            return res.send(msgConfig.badRequestesMsgs._failMsg, 403, message)
        })
    } catch (err) {
        console.log("THIS IS FROM CHECKACCSESS(ACMANAGER) MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }

}

exports.protect = async (req, res, next) => {
    try {
        let token;
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
        let currentUser = await ac.findUser(decoded.payload)
        //console.log( "this is from authorize",  currentUser);
        //if token expired or user no longer exist return false
        if (currentUser.length <= 0) {
            message = msgConfig.unauthorizeMsgs._expireTokenOrNoExist
            sendStatusCodeAndSetHeader(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.unauthorizeMsgs._unauthorizeStatusCode, message, null)
            return;
        }
        // get access if all conditions true and set req.user to current user for access in whole application exports.s
        req.user = currentUser;
        next()
    } catch (err) {
        console.log("THIS IS FROM PROTECT(ACMANAGER) MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

// let currentUser = await ac.findUser(decoded.payload)