const userQuerysController = require("./controller/userQuerysController")
const {
    getTitle,
    find,
    addPost,
    findById,
    findOne,
    updateById,
    updateOne,
    deleteById
} = require("./controller/blogsQuerysController")
const {
    protect,
    checkAccess
} = require("./middlewares/systemMiddleware")
const dataParser = require("kando-dataparser")
module.exports = {
    // * User Apis 
    "/api/v1/db/users": {
        "GET": {
            function: userQuerysController.getAllUsers,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/users/getUserById": {
        "GET": {
            function: userQuerysController.findById,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/users/register": {
        "POST": {
            function: userQuerysController.register,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/users/email": {
        "GET": {
            function: userQuerysController.emailExist,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/users/createtable": {
        "POST": {
            function: userQuerysController.createTable,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/users/createblog": {
        "POST": {
            function: userQuerysController.createBlogForUser,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/users/user": {
        "PUT": {
            function: userQuerysController.findByIdAndUpdate,
            middlewares: [dataParser, protect, checkAccess]
        },
        "DELETE": {
            function: userQuerysController.findByIdAndDelete,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/users/updatepassword": {
        "PUT": {
            function: userQuerysController.updatePassword,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/users/createadmin": {
        "POST": {
            function: userQuerysController.createAdmin,
            middlewares: [dataParser, protect, checkAccess]
        },
    },


    //  * Blog And Posts Apis
    "/api/v1/db/blogs/getAll": {
        "GET": {
            function: find,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/blogs/posts/title": {
        "GET": {
            function: getTitle,
            middlewares: [dataParser, protect, checkAccess]
        }
    },
    "/api/v1/db/blogs/findById": {
        "GET": {
            function: findById,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/blogs/findOne": {
        "POST": {
            function: findOne,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/blogs/posts": {
        "POST": {
            function: addPost,
            middlewares: [dataParser, protect, checkAccess]
        },
        "DELETE": {
            function: deleteById,
            middlewares: [dataParser, protect, checkAccess]
        },
        "PUT": {
            function: updateById,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
    "/api/v1/db/blogs/posts/updateOne": {
        "PUT": {
            function: updateOne,
            middlewares: [dataParser, protect, checkAccess]
        },
    },
}