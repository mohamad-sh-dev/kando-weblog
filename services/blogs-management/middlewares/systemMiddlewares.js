const userModel = require("../../user-management/model/userModel");
const {
    sendStatusCodeAndSetHeader,
} = require("kando-utils")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const msgConfig = require("../config/msgConfig");

let message;

exports.checkUserRole = (req, res, next) => {
    if (!req.user[0].rolename.includes("bloger")) {
        message = msgConfig.badRequestesMsgs._justBlogersAccess
        return res.send(msgConfig.badRequestesMsgs._failMsg,
            msgConfig.badRequestesMsgs._badRequestStatusCode, message)
    }
    next();
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
        const currentUser = await new userModel().getUserById(decoded.payload)
        //console.log( "this is from authorize",  currentUser);
        //if token expired or user no longer exist return false
        if (currentUser.length <= 0) {
            message = msgConfig.unauthorizeMsgs._expireTokenOrNoExist;
            sendStatusCodeAndSetHeader(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message, null)
            return;
        }
        // get access if all conditions true and set req.user to current user for access in whole application exports.s
        req.user = currentUser.data;
        next()
    } catch (err) {
        console.log("THIS IS FROM PROTECTBLOGMANAGEMENT MIDDLEWARE CATCH ERR", err); // for developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.checkAccess = async (req, res, next) => {
    try {
        const AcUrl = "http://localhost:8080/accesscontroll/api/v1/getPermision"
        const {
            method,
            user,
            url
        } = req
        const result = await axios({
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
        })
        console.log("Check Access Middleware", result.data);
        next()
    } catch (err) {
        console.log("THIS IS FROM BLOGSMANAGEMENT SYSTEM MIDDLEWARE", err.response.data);
        if (err.response.data.status === "not found") {
            console.log(err.response.data);
            message = err.response.data.response;
            return res.send(err.response.data.status, 404, message)
        }
        if (err.response.data.status === msgConfig.badRequestesMsgs._failMsg) {
            message = err.response.data.response;
            return res.send(err.response.data.status,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        message = msgConfig.forbiddenMsgs._forbiddenMsg
        console.log("ERROR", err.response.data);
        return res.send(msgConfig.badRequestesMsgs._failMsg,
            msgConfig.forbiddenMsgs._forbiddenStatusCode, message)
    }
}