const {updatePassword , deAtctiveUser , getProfile,getUsers,updateProfile} = require("./controller/userControll");
const adminController = require("./controller/admin/adminController");
const authController = require("./controller/auth/authentication")
const dataParser = require("kando-dataparser");

const {
    checkCaptcha,
    checkEmail,
    schemaValidation,
    checkUser
} = require("./middlewares/checkMiddlewares")
const {
    protect,
    checkAccess
} = require("./middlewares/accessMiddlewares")

module.exports = {
    "/api/v1/users": {
        "GET": {
            function: getUsers,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/users/login": {
        "POST": {
            function: authController.login,
            middlewares: [dataParser]
        }
    },
    "/api/v1/users/register": {
        "POST": {
            function: authController.registerUser,
            middlewares: [dataParser, schemaValidation, checkEmail, checkCaptcha]
        },
    },
    "/api/v1/users/user": {
        "GET": {
            function: getProfile,
            middlewares: [dataParser, protect,checkAccess]
        },
        "PUT": {
            function: updateProfile,
            middlewares: [dataParser, protect,checkAccess]
        },
        "DELETE": {
            function: deAtctiveUser,
            middlewares: [dataParser, protect,checkAccess]
        }
    },
    "/api/v1/users/user/updatePassword": {
        "PUT": {
            function: updatePassword,
            middlewares: [dataParser, protect,checkAccess]
        }
    },
    "/api/v1/admin": {
        "POST": {
            function: adminController.createAdmins,
            middlewares: [dataParser, protect, checkAccess, checkEmail]
        }
    },
    "/api/v1/admin/users": {
        "DELETE": {
            function: adminController.deleteUser,
            middlewares: [dataParser, protect, checkAccess,
                checkUser
            ]
        },
        "POST": {
            function: adminController.createAdmins,
            middlewares: [dataParser, protect, checkAccess]
        }
    },
}