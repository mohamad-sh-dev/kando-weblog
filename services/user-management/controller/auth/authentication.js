const {
    hashPassword,
    comparePassword
} = require("../../utils/bcryptFunctions")
const {
    CreateJwtToken
} = require("../../utils/jwt")
const User = require("../../model/userModel")
const userModel = new User()
const msgConfig = require("../../config/msgConfig")
// Register Handdler
const registerUser = async (req, res) => {
    try {
        // 1) Get Imformation From Client | Hash Password
        const {
            firstname,
            lastname,
            email,
            password,
            signupAt,
        } = req.body
        const hashedPassword = await hashPassword(password)
        // 2 ) Create new User Model And Set Arguments | Handdle Errors 
        const newUser = await userModel.registerUser(firstname, lastname, email, hashedPassword, signupAt)

        // 3) Create Blog For Registered User With UserId | Create Role (bloger) 
        await userModel.createBlogForEachBloger(newUser.data[0].id)
        await userModel.createRole(newUser.data[0].id, "bloger")
        // register user and send response
        message = msgConfig.successMsgs._createSuccessfullyMsg
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successCreateStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM REGISTER HANDDLER CATCH ERROR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
};

// Login Handdler
const login = async (req, res) => {
    try {
        // 1) Get Login Imformation From Client
        const {
            email,
            password
        } = req.body
        if (!email || !password) {
            message = msgConfig.badRequestesMsgs._cantBeEmpty;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs.badRequestesMsgs, message)
        }
        // 2) Create New User Model | Call Check Email And Give Email As Argument | Handdle Errors
        const check = await userModel.checkEmail(email);
        // 3) This Email No Exist In Application 
        if (check.data.length <= 0) {
            message = msgConfig.notFoundMsgs._notFoundEmail
            return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                msgConfig.notFoundMsgs._notFoundStatusCode, message)
        }
        // 4 ) Password Comparsion
        const userPassword = check.data[0].password;
        const response = await comparePassword(password, userPassword);
        // Password Is Wrong 
        if (response !== true) {
            message = msgConfig.unauthorizeMsgs._wrongEmailOrPass
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.unauthorizeMsgs._unauthorizeStatusCode, message)
        } else {
            // 5) User Log In | Create jwt Token | Send Token With Response Object
            const id = check.data[0].userId
            // Set User Active Property To True In Login Action
            await userModel.findByIdAndUpdate(id, "active")
            message = msgConfig.successMsgs._successEnter
            const token = CreateJwtToken(check.data[0].userId)
            res.send(msgConfig.successMsgs._successMsg,
                msgConfig.successMsgs._successStatusCode, message, {
                    token
                })
        }
    } catch (err) {
        console.log("THIS IS FROM LOGIN HANDDLER CATCH ERROR", err); // For developer
        message = "مشکلی در دریافت اطلاعات وجود دارد لطفا مجددا تلاش نمایید";
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}
module.exports = {
    registerUser,
    login,
}