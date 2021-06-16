const postsController = require("./controller/postController")
const blogsController = require("./controller/blogsController")
const tagCatController = require("./controller/tagsCatController")
const commentController = require("./controller/commnetContoller")
const adminController = require("./controller/admin/adminController")
const dataParser = require("kando-dataparser")
const {
    // checkTitle,
    schemaValidation,
    getAllPostsForAdmin,
    checkPost,
    checkForbidenWords,
    checkAccessToPostUseBlogId
} = require("./middlewares/postMiddlewares")
const {
    protect,
    checkUserRole,
    checkAccess,
} = require("./middlewares/systemMiddlewares")
const {
    tagAndCateditValidation,
} = require("./middlewares/tagCatMiddlewares")
const {
    ckeckAccessToCmUseUserId,
} = require("./middlewares/cmMiddlewares")
const {
    adminDeleteCatValidation,
    adminDeleteCmValidation,
    adminDeleteTagValidation,
} = require("./middlewares/adminDeleteActionsMiddlewar")



module.exports = {
    "/api/v1/weblogs": {
        "GET": {
            function: blogsController.getAllWeblogs,
            middlewares: [dataParser]
        },
    },
    "/api/v1/weblogs/categorysAndTags": {
        "GET": {
            function: blogsController.getAllCategorysAndTagsInBlog,
            middlewares: [dataParser]
        },
    },
    "/api/v1/weblogs/posts": {
        "GET": {
            function: postsController.getAllPosts,
            middlewares: [dataParser, getAllPostsForAdmin]
        },
    },
    "/api/v1/weblogs/userWeblog": {
        "GET": {
            function: blogsController.userBlog,
            middlewares: [dataParser, protect, checkAccess, checkUserRole]
        },
    },
    "/api/v1/weblogs/userWeblog/posts": {
        "GET": {
            function: postsController.getMyPosts,
            middlewares: [dataParser, protect, checkAccess]
        },
        "POST": {
            function: postsController.addPost,
            middlewares: [dataParser, protect, checkAccess, schemaValidation,
                checkForbidenWords
            ] // checkTitle ?!
        },
        "PUT": {
            function: postsController.editPost,
            middlewares: [dataParser, protect, checkAccess,
                checkPost, checkAccessToPostUseBlogId, schemaValidation,
                checkForbidenWords
            ]
        },
        "DELETE": {
            function: postsController.deletePost,
            middlewares: [dataParser, protect, checkAccess,
                checkPost, checkAccessToPostUseBlogId
            ]
        }
    },
    "/api/v1/weblogs/userWeblog/posts/comments/status": {
        "PUT": {
            function: commentController.editCommentStatus,
            middlewares: [dataParser, protect, checkAccess, checkUserRole,
                checkPost, checkAccessToPostUseBlogId
            ]
        }
    },
    "/api/v1/weblogs/posts/comments": {
        "POST": {
            function: commentController.addcommnet,
            middlewares: [dataParser, protect, checkAccess, checkPost,
                checkForbidenWords
            ]
        },
        "PUT": {
            function: commentController.editComment,
            middlewares: [dataParser, protect, checkAccess,
                ckeckAccessToCmUseUserId
            ]
        },
        "DELETE": {
            function: commentController.deleteComment,
            middlewares: [dataParser, protect, checkAccess,
                ckeckAccessToCmUseUserId
            ]
        }
    },
    "/api/v1/weblogs/userWeblog/posts/tags": {
        "POST": {
            function: tagCatController.addTags,
            middlewares: [dataParser, protect, checkAccess,checkPost,
                checkUserRole,checkAccessToPostUseBlogId,
                schemaValidation
            ]
        },
        "PUT": {
            function: tagCatController.editTags,
            middlewares: [dataParser, protect, checkAccess,
                checkUserRole, tagAndCateditValidation
            ]
        },
        "DELETE": {
            function: tagCatController.deleteTag,
            middlewares: [dataParser, protect, checkAccess,
                tagAndCateditValidation
            ]
        }
    },
    "/api/v1/weblogs/userWeblog/posts/categorys": {
        "POST": {
            function: tagCatController.addCategory,
            middlewares: [dataParser, protect, checkAccess,checkPost,
                checkUserRole,checkAccessToPostUseBlogId,
                schemaValidation
            ]
        },
        "PUT": {
            function: tagCatController.editCategory,
            middlewares: [dataParser, protect, checkAccess,
                checkUserRole, tagAndCateditValidation
            ]
        },
        "DELETE": {
            function: tagCatController.deleteCategory,
            middlewares: [dataParser, protect, checkAccess,
                checkUserRole, tagAndCateditValidation
            ]
        }
    },
    "/api/v1/weblogs/admin/posts": {
        "DELETE": {
            function: adminController.deletePost,
            middlewares: [dataParser, protect, checkAccess,
                checkPost
            ]
        }
    },
    "/api/v1/weblogs/admin/posts/categorys": {
        "DELETE": {
            function: adminController.deleteCategory,
            middlewares: [dataParser, protect, checkAccess,
                adminDeleteCatValidation
            ]
        }
    },
    "/api/v1/weblogs/admin/posts/tags": {
        "DELETE": {
            function: adminController.deleteTag,
            middlewares: [dataParser, protect, checkAccess,
                adminDeleteTagValidation
            ]
        }
    },
    "/api/v1/weblogs/admin/posts/comments": {
        "DELETE": {
            function: adminController.deleteComment,
            middlewares: [dataParser, protect, checkAccess,
                adminDeleteCmValidation
            ]
        }
    },
}