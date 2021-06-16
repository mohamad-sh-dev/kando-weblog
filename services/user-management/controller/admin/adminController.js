const User = require("../../model/userModel");
const userModel = new User()
const {
    hashPassword
} = require("../../utils/bcryptFunctions");
const {
    convertDate
} = require("kando-utils")
const msgConfig = require("../../config/msgConfig")

let message;
exports.deleteUser = async (req, res) => {
    try {
        const id = req.userId
        await userModel.findByIdAndDelete(id)
        message = msgConfig.successMsgs._deleteMsg
        return res.send(msgConfig.successMsgs._successMsg,
            msgConfig.deleteStatusCode._deleteStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM ADMINDELETEUSER HANDLLER CATCH ERR", err); // for developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.createAdmins = async (req, res) => {
    const createdAt = convertDate(new Date)
    let {
        email,
        password
    } = req.body
    if (!email || !password) {
        message = msgConfig.badRequestesMsgs._hasNoEnterEmailAndPass
        return res.send(msgConfig.badRequestesMsgs._failMsg,
            msgConfig.badRequestesMsgs._badRequestStatusCode, message)
    }
    const hashedPasswod = await hashPassword(password);
    password = hashedPasswod;
    const newAdmin = await userModel.createAdmins(email, password, createdAt)
    if (newAdmin.data.code || typeof newAdmin.data === "string") {
        console.log(newAdmin.data); // for developer
        message =msgConfig.internalServerErr._internalServerErr
        return res.send(msgConfig.badRequestesMsgs._failMsg, 500, message);
    }
    await userModel.createRole(newAdmin.data[0].id, "admin")
    message = "اطلاعات با موفقیت ثبت شد";
    res.send(msgConfig.successMsgs._successMsg, 
        msgConfig.successMsgs._successCreateStatusCode, message)
}