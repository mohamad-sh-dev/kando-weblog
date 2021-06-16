const Blog = require("../model/blogModel")
const userModel = require("../../user-management/model/userModel");
const blogModel = new Blog()
const {
    convertDate,
    buildHumanErrorsForJsonSchema
} = require("kando-utils");
const {
    createValidateWithAjv,
    postSchema
} = require("../schema/postSchema");
const jwt = require("jsonwebtoken");
const msgConfig = require("../config/msgConfig");

exports.checkTitle = async (req, res, next) => {
    try {
        let postId;
        const {
            title
        } = req.body
        if (req.body.postId) {
            postId = req.body.postId
        }
        const result = await blogModel.CheckTitle(title)

        if (result.data.length > 0) {
            // This If For Edit Post | Handdle Duplicate Title 
            if (result.data[0].id === postId) {
                return next()
            }
            let message = msgConfig.badRequestesMsgs._duplicateTitle;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        }
        next()
    } catch (err) {
        console.log("THIS IS FROM POSTCHECKTITLE MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.schemaValidation = (req, res, next) => {
    try {
        const date = convertDate(new Date)
        const postObj = {
            title: req.body.title ? req.body.title : "این یک عنوان تست میباشد",
            body: req.body.body ? req.body.body : "این  یک متن تست برای ولیدیت میباشد",
            createdAt: `"${date}"`,
            tag: req.body.tag ? req.body.tag : "#هشتگ",
            category: req.body.category ? req.body.category : "پیش فرض"
        }
        const valid = createValidateWithAjv(postSchema, postObj)
        if (valid.isValid !== true) {
            buildHumanErrorsForJsonSchema(valid.errors)
            res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, valid.errors[0].message)
            return;
        }
        req.body.createdAt = date
        next()
    } catch (err) {
        console.log("THIS IS FROM SCHEMAVALIDATION MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }

}

exports.getAllPostsForAdmin = async (req, res, next) => {
    try {
        let token;
        // Check token from request 
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (token) {
            const decoded = jwt.verify(token, process.env._JWT_SECRET_KEY)
            // Token verifyed and find user with our User model methods 
            const currentUser = await new userModel().getUserById(decoded.payload)
            if (currentUser.length <= 0) {
                return next()
            }
            let rolename = currentUser.data[0].rolename
            if (rolename.includes("admin") || rolename.includes("owner")) {
                let result = await blogModel.find("Posts")
                if (result.data.code || typeof result.data === "string") {
                    console.log("FROM GETALLPOSTS MIDDLEWARE", result.data);
                    req.postsForAdmin = result.data
                    return next()
                }
                if (result.data.length <= 0) {
                    req.postsForAdmin = result.data
                    return next()
                }
                const posts = result.data.map(post => {
                    if (post.tags[0] === null) {
                        post.tags = []
                    }
                    if (post.comments[0] === null) {
                        post.comments = []
                    }
                    return JSON.parse(JSON.stringify(post));
                })
                req.postsForAdmin = posts;
                return next()
            }
            return next()
        }
        next()
    } catch (err) {
        console.log("THIS IS FROM GETALLPOSTSFORADMIN MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }

}

exports.checkPost = async (req, res, next) => {
    try {
        const {
            postId
        } = req.body
        // console.log(req.body);
        if (!postId) {
            message = msgConfig.badRequestesMsgs._hasNotEnterPostId
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        const findPost = await blogModel.findById(postId, "Post")
        if (findPost.data.length <= 0) {
            message = msgConfig.notFoundMsgs._noPostWithId
            return res.send("not found", 404, message);
        }
        if (req.body.comment) {
            const allowCm = findPost.data[0].addComment
            if (allowCm !== true) {
                message = msgConfig.badRequestesMsgs._notAllowedComment
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.badRequestesMsgs._badRequestStatusCode, message);
            }
        }
        req.post = findPost.data[0]
        next()
    } catch (err) {
        console.log("THIS IS FROM CHECKPOST MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.checkAccessToPostUseBlogId = async (req, res, next) => {
    try {
        const {
            userId
        } = req.user[0]
        // Old Way To Access For The Post | Find User Blog Id And Comparison With Post Blog Id | All Posts Belong To Specific Blog
        const findBlog = await blogModel.findOne("Blog", userId, "", "", "UserId")

        const postBlogId = req.post.blogId
        const BlogId = findBlog.data[0].id

        if (postBlogId !== BlogId) {
            message = msgConfig.badRequestesMsgs._postBelongToOtherBlog
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        next()
    } catch (err) {
        console.log("THIS IS FROM checkAccessUseBlogId MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.checkForbidenWords = async (req, res, next) => {
    try {
        let bodyWords;
        let titleWords;
        let commentWords;
        let body;
        let title;
        let comment;
        req.body.body ? body = req.body.body : "";
        req.body.title ? title = req.body.title : ""
        req.body.comment ? comment = req.body.comment : ""
        body ? bodyWords = body.split(" ") : ""
        title ? titleWords = title.split(" ") : ""
        comment ? commentWords = comment.split(" ") : ""
        const forbidenWords = await blogModel.find("ForbidenWords")
        if (bodyWords !== undefined) {
            let filteredBody;
            for (i = 0; i < bodyWords.length; i++) {
                for (x = 0; x < forbidenWords.data.length; x++) {
                    if (bodyWords[i] === forbidenWords.data[x].word) {
                        bodyWords[i] = "--بوووق--"
                    }
                }
            }
            filteredBody = bodyWords.toString().split(",").join(" ");
            req.body.body = filteredBody;
        }
        if (titleWords !== undefined) {
            let filteredTitle;
            for (i = 0; i < titleWords.length; i++) {
                for (x = 0; x < forbidenWords.data.length; x++) {
                    if (titleWords[i] === forbidenWords.data[x].word) {
                        titleWords[i] = "--بوووق--"
                    }
                }
            }
            filteredTitle = titleWords.toString().split(",").join(" ");
            req.body.title = filteredTitle;
        }
        if (commentWords !== undefined) {
            let filteredComment;
            for (i = 0; i < commentWords.length; i++) {
                for (x = 0; x < forbidenWords.data.length; x++) {
                    if (commentWords[i] === forbidenWords.data[x].word) {
                        commentWords[i] = "--بوووق--"
                    }
                }
            }
            filteredComment = commentWords.toString().split(",").join(" ");
            req.body.comment = filteredComment;
        }
        next();
    } catch (err) {
        console.log("THIS IS FROM CHECKPOST MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}