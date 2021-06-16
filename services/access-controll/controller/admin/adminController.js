const AccessControll = require("../../model/acceessModel");
const ac = new AccessControll();
const msgConfig = require("../../config/msgConfig")

exports.getAllAccesses = async (req, res) => {
    try {
        const result = await ac.getAllAccesses()
        // console.log(result);
        if (result.length <= 0) {
            message = msgConfig.notFoundMsgs._notAccessFound
            return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                msgConfig.notFoundMsgs._notFoundStatusCode, message);
        }
        message = msgConfig.successMsgs._allAccesses
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message, result)
    } catch (err) {
        console.log("THIS IS FROM GETALLACCESS HANDDLER", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }

}

exports.addRoleToResuorce = async (req, res) => {
    try {
        const {
            role,
            api
        } = req.body
        if (!role || !api) {
            message = msgConfig.badRequestesMsgs._hasNoEnterRoleOrResuorce;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        const result = await ac.searchForAc(api)
        if (result.length > 0) {
            const roleName = result.find(r => {
                return r.rolename === role
            })
            if (!roleName) {
                // console.log(result);
                const operationId = result[0].operationId
                const apiId = result[0].apiId
                await ac.addRoleToExistApi(operationId, apiId, role)
                message = msgConfig.successMsgs._SuccessFullyCreate;
                return res.send(msgConfig.successMsgs._successMsg,
                    msgConfig.successMsgs._successCreateStatusCode, message);
            }
            message = msgConfig.badRequestesMsgs._hasThisRole;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        }
        message = msgConfig.notFoundMsgs._notDataFound;
        res.send(msgConfig.notFoundMsgs._notFoundMsg,
            msgConfig.notFoundMsgs._notFoundStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM ADDROLETORESUORCE HANDDLER", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}


exports.addAccess = async (req, res) => {
    try {
        let message;
        // 1) Get Api Operation And Role From Body
        const {
            api,
            operation,
            role
        } = req.body
        // console.log("this is req.body" , req.body);
        if (!api || !operation) {
            message = msgConfig.badRequestesMsgs._invalidInformations;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        // 2) Need To Add Access Just For Admin Or Bloger !
        if (role === "admin" || role === "bloger") {
            await ac.addAccess(api, operation, role)
            // if (typeof result === "string") {
            //     message = "مشکلی به وجود امده است لطفا مجددا تلاش نمایید"
            //     console.log(result);
            //     return res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
            // }
            message = msgConfig.successMsgs._SuccessfullyAccessCreate;
            res.send(msgConfig.successMsgs._successMsg, 
                msgConfig.successMsgs._successCreateStatusCode, message);
        } else {
            message = msgConfig.badRequestesMsgs._hasWrongRole
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
    } catch (err) {
        console.log("THIS IS FROM ACCESSCONTROLL ADDACCESS HANDDLER", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}
exports.deleteAccess = async (req, res) => {
    try {
        let message;
        // 1) Get Api Operation And Role From Body
        const {
            api,
            role
        } = req.body
        if (!api || !role) {
            message =msgConfig.badRequestesMsgs._hasNoEnterInformation
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        // 2) Need To Add Access Just For Admin Or Bloger !
        if (role === "admin" || role === "bloger") {
            const result = await ac.deleteAccess(api, role)
            if (result.rowCount <= 0) {
                message = msgConfig.notFoundMsgs._noAccessFound;
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message)
            }
            res.send(msgConfig.successMsgs._successMsg, msgConfig.deleteStatusCode._deleteStatusCode);
        } else {
            message = msgConfig.badRequestesMsgs._hasWrongRole
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
    } catch (err) {
        console.log("THIS IS FROM DELETEACCESS HANDDLER", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.assignRole = async (req, res) => {
    try {
        const {
            userId,
            roleName
        } = req.body
        if (!userId || !roleName) {
            message = msgConfig.badRequestesMsgs._hasNoEnterRoleAndName;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        }
        await ac.assignRole(userId, roleName)
        message = msgConfig.successMsgs._roleAdded
        res.send(msgConfig.successMsgs._successMsg, 
            msgConfig.successMsgs._successCreateStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM ASSIGNROLE HANDDLER", err);
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message, err)
    }
}


// exports.removeRoleFromResuorce = async (req, res) => {
//     try {
//         const {
//             role,
//             api
//         } = req.body
//         if (!role || !api) {
//             message = msgConfig.badRequestesMsgs._hasNoEnterRoleOrResuorce;
//             return res.send(msgConfig.badRequestesMsgs._failMsg,
//                 msgConfig.badRequestesMsgs._badRequestStatusCode, message)
//         }
//         const result = await ac.searchForAc(api)
//         // console.log(result);
//         if (result.length > 0) {
//             const roleName = result.find(r => {
//                 return r.rolename === role
//             })
//             if (roleName) {
//                 // console.log(result);
//                 const operationId = result[0].operationId
//                 const apiId = result[0].apiId
//                 await ac.RmoveRoleFromExistApi(operationId, apiId, role)
//                 message = msgConfig.successMsgs._SuccessFullyCreate;
//                 return res.send(msgConfig.successMsgs._successMsg, 
// msgConfig.successMsgs._successCreateStatusCode, message);
//             }
//             message = "منبعی برای نقش وارد شده وجود می باشد";
//             return res.send(msgConfig.badRequestesMsgs._failMsg,
//                 msgConfig.badRequestesMsgs._badRequestStatusCode, message);
//         }
//         message = msgConfig.notFoundMsgs._notDataFound;
//         res.send(msgConfig.notFoundMsgs._notFoundMsg,
//             msgConfig.notFoundMsgs._notFoundStatusCode, message)
//     } catch (err) {
//         console.log("THIS IS FROM ADDROLETOAC HANDDLER", err);
//         message = msgConfig.internalServerErr._internalServerErr;
//         res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
//     }
// }