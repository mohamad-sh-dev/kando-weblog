const accessController = require("./controller/accessController");
const adminController = require("./controller/admin/adminController");
const {
    checkAccess,
    protect,
    urlParser
} = require("./middlewares/systemMiddlewares")
const dataParser = require("kando-dataparser")

module.exports = {
    "/accesscontroll/api/v1/getPermision": {
        "POST": {
            function: accessController.permision,
            middlewares: [dataParser,protect , urlParser]
        },
    },
    "/accesscontroll/api/v1/assignRole": {
        "POST": {
            function: adminController.assignRole,
            middlewares: [dataParser, protect,checkAccess]
        },
    },
    "/accesscontroll/api/v1/admin": {
        "POST": {
            function: adminController.addAccess,
            middlewares: [dataParser, protect,checkAccess]
        },
        "DELETE": {
            function: adminController.deleteAccess,
            middlewares: [dataParser, protect,checkAccess]
        },
        "GET": {
            function: adminController.getAllAccesses,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/accesscontroll/api/v1/admin/role": {
        "POST": {
            function: adminController.addRoleToResuorce,
            middlewares: [dataParser,protect,checkAccess]
        },
        // "DELETE": {
        //     function: adminController.removeRoleFromResuorce,
        //     middlewares: [dataParser, protect,checkAccess]
        // },
    },
}