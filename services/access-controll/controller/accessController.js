const AccessControll = require("../model/acceessModel");
const ac = new AccessControll();
const {
    comparePassword
} = require("../utils/bcryptHelper")
const msgConfig = require("../config/msgConfig")

let message;
exports.permision = async (req, res) => {
    try {
        // 1) Get Api Operation And User From Request || Send By Serviec Who Requested
        let {
            user, // this User Come From Req In Service Who Requested To Ac Service
            method,
            url
        } = req.body
        // 2) Find Access For User Role
        const result = await ac.getPermisions(user[0].rolename, url);
        // No Access Found For This Role || Check User Role
        // Handdle No Result
        if (result.length <= 0) {
            if (user[0].rolename === 'owner') {
                // console.log(user);
                const password = req.body.ownerPassword
                if (!password) {
                    message = msgConfig.badRequestesMsgs._hasNoEnterOwnerPass;
                    return res.send(msgConfig.badRequestesMsgs._failMsg,
                        msgConfig.badRequestesMsgs._badRequestStatusCode, message);
                }
                const ownerPassword = user[0].password
                const truePassword = await comparePassword(password, ownerPassword)
                if (truePassword !== true) {
                    message = msgConfig.unauthorizeMsgs._hasNoAuthorize
                    return res.send(msgConfig.badRequestesMsgs._failMsg,
                        msgConfig.unauthorizeMsgs._unauthorizeStatusCode, message)
                }
                message = `Access Grant For ${user[0].rolename}`;
                return res.send(msgConfig.successMsgs._successAuthorizeMsg,
                    msgConfig.successMsgs._successStatusCode, message);
            } else {
                message = msgConfig.notFoundMsgs._noAccessFound
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message);
            }
        }
        // 3) Search For Api And Operation || If There Is Not Operation Or Api Then No Access
        if (user[0].rolename !== 'owner') {
            // Find Result Match With User | Query Also Return All Users Who Got This RoleName
            const userAccess = result.find(au => {
                return au.userId === user[0].userId &&
                    au.api === url && au.operation === method
            })
            // console.log("userAccess" ,userAccess );
            if (!userAccess) {
                message = `Access Denied For This Role , Api ${url}  `;
                return res.send(msgConfig.forbiddenMsgs._forbiddMsg,
                    msgConfig.forbiddenMsgs._forbiddenStatusCode, message)
            }
        }
        // There Is Operation And Api For This Role Then Access To User (next())
        message = `Access Grant For ${user[0].rolename} With This Name ${user[0].firstname} `;
        res.send(msgConfig.successMsgs._successAuthorizeMsg,
            msgConfig.successMsgs._successStatusCode, message);
    } catch (err) {
        console.log("THIS IS FROM ACCESSFORAPI HANDDLER", err);
    }
}