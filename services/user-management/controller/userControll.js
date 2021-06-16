const User = require("../model/userModel");
const {
    filterObj
} = require("../utils/filterBody")
// const Email = require("../utils/emailConfiguration");
const {
    hashPassword,
    comparePassword
} = require("../utils/bcryptFunctions");
const msgConfig = require("../config/msgConfig")

let message;
const userModel = new User();


//* implementation getUsers handdlers
exports.getUsers = async (req, res) => {
    try {
        if (req.query.id) {
            const {
                id
            } = req.query
            let result = await userModel.getUserById(id)
            if (result.data.length <= 0) {
                message = msgConfig.notFoundMsgs.noUserFoundWithIdMsg
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message)
            }
            let user = result.data.map(user => {
                user.password = undefined;
                return JSON.parse(JSON.stringify(user))
            });
            message = "Result" + user.length
            return res.send(msgConfig.successMsgs._successMsg,
                msgConfig.successMsgs._successStatusCode, message, user);
        } else if (req.query.email) {
            const {
                email
            } = req.query
            let result = await userModel.checkEmail(email)
            // return console.log(result);
            if (result.data.length <= 0) {
                message = msgConfig.notFoundMsgs.noUserFoundWithEmailMsg
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message)
            }
            let user = result.data.map(user => {
                user.password = undefined;
                return JSON.parse(JSON.stringify(user))
            });
            message = "Result" + user.length
            return res.send(msgConfig.successMsgs._successMsg,
                msgConfig.successMsgs._successStatusCode, message, user);
        }
        // Call User Model getUsers Method
        const users = await userModel.getUsers()
        if (users.data.length <= 0) {
            message = msgConfig.notFoundMsgs._noUserFound
            return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                msgConfig.notFoundMsgs._notFoundStatusCode, message)
        }
        // Delete User Password And Send Rest Of Data
        const allUsers = users.data.map(user => {
            user.password = undefined;
            return JSON.parse(JSON.stringify(user))
        });
        message = allUsers.length + "Result"
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message, allUsers);
    } catch (err) {
        console.log("THIS IS FROM GETUSER HANDLLER CATCH ERR", err); // for developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}
//* implementation user info handdler (profile) 
exports.getProfile = async (req, res) => {
    try {
        // Find User Id | Call getUserById Method
        const id = req.user[0].userId
        const user = await userModel.getUserById(id)
        // Delete Sensitive Data
        if (user.data) {
            delete user.data[0].password;
            delete user.data[0].isActive;
            delete user.data[0].userId;
            delete user.data[0].rolename;
            // Send Rest Of Sata
            let finalResult = user.data[0]
            message = `${user.data[0].firstname} پروفایل`
            res.send(msgConfig.successMsgs._successMsg,
                msgConfig.successMsgs._successStatusCode, message, finalResult)
        }
    } catch (err) {
        console.log("THIS IS FGROM GETME HANDDLER CATCH ERR", err); // for developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}


exports.updateProfile = async (req, res) => {
    if (req.body.password) {
        message = msgConfig.badRequestesMsgs._cantEditFromHere_pass;
        return res.send(msgConfig.badRequestesMsgs._failMsg,
            msgConfig.badRequestesMsgs._badRequestStatusCode, message)
    }
    // Controll What Fields User Can Update 
    const filteredBody = filterObj(req.body, "firstname", "lastname", "email");
    //find userId
    const userId = req.user[0].userId
    try {
        // make new User model and call updateUser method
        await userModel.findByIdAndUpdate(userId, "update", filteredBody)
        message = msgConfig.successMsgs._createSuccessfullyMsg
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM UPDATEME HANDDLER CATCH ERR", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const {
            currentPass,
            newPass
        } = req.body
        if (!currentPass || !newPass) {
            message = msgConfig.badRequestesMsgs.password._enterCurrentPassword;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        }
        // 1) Find User With Id (avalable in Authorize midllware) 
        const user = await userModel.getUserById(req.user[0].userId)
        // 2) Check If Current Password Is true
        const truePassword = await comparePassword(currentPass, user.data[0].password)
        if (truePassword !== true) {
            message = msgConfig.badRequestesMsgs._wrongPass
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        // 3) Set New Password
        const hasshedPass = await hashPassword(newPass)
        await userModel.findByIdAndUpdate(req.user[0].userId, "changePassword", {
            password: hasshedPass
        })
        // Send Response Fro Suceess
        message = msgConfig.successMsgs._successEditPass
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM UPDATEPASSWORD HANDDLER CATCH ERR", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
    }
}

exports.deAtctiveUser = async (req, res) => {
    try {
        const id = req.user[0].userId
        await userModel.findByIdAndUpdate(id, "deActive");
        message = msgConfig.successMsgs._successDeactive;
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM DEACTIVEUSER HANDDLER CATCH ERR", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
    }
}