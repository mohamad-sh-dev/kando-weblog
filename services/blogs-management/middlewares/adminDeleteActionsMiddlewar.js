const Blog = require("../model/blogModel")
const BlogModel = new Blog()
const msgConfig = require("../config/msgConfig");

exports.adminDeleteCmValidation = async (req, res, next) => {
    try {
        const {
            currentComment,
            commentId
        } = req.body
        if (currentComment !== undefined) {
            if (currentComment === "") {
                message = msgConfig.badRequestesMsgs._hasNotEnterComment;
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.badRequestesMsgs._badRequestStatusCode, message);
            }
            const cmPropertis = await BlogModel.findOne('Comment', "", 'messages', currentComment)
            if (cmPropertis.data.length <= 0) {
                message = msgConfig.notFoundMsgs._noComment;
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message)
            }

            req.body.cmId = cmPropertis.data[0].id
            req.body.cmBlongToUserId = cmPropertis.data[0].userId
            req.body.cmBlongToPostId = cmPropertis.data[0].postId
            console.log(req.body.cmId,
                req.body.cmBlongToUserId, req.body.cmBlongToPostId);
            return next()
        } else
        if (commentId !== undefined) {
            const cmPropertis = await BlogModel.findById(commentId, "Comment")
            if (cmPropertis.data.length <= 0) {
                message = msgConfig.notFoundMsgs._noComment;
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message)
            }
            req.body.cmId = cmPropertis.data[0].id
            req.body.cmBlongToUserId = cmPropertis.data[0].userId
            req.body.cmBlongToPostId = cmPropertis.data[0].postId
            console.log(req.body.cmId,
                req.body.cmBlongToUserId, req.body.cmBlongToPostId);
            return next()
        }

    } catch (err) {
        console.log("THIS IS FROM ADMINDELETECMVALIDATION MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}


exports.adminDeleteTagValidation = async (req, res, next) => {
    try {
        const {
            currentTag,
            tagId
        } = req.body
        if (currentTag !== undefined) {
            if (currentTag === "") {
                message = msgConfig.badRequestesMsgs._hasNotEnterTag;
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.badRequestesMsgs._badRequestStatusCode, message);
            }
            const tagPropertis = await BlogModel.findOne('Tag', "", 'tags', currentTag)
            if (tagPropertis.data.length <= 0) {
                message = msgConfig.notFoundMsgs._noTag;
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message)
            }

            req.body.tagId = tagPropertis.data[0].id
            req.body.tagBlongToUserId = tagPropertis.data[0].userId
            req.body.tagBlongToPostId = tagPropertis.data[0].postId

            return next()
        } else
        if (tagId !== undefined) {
            const tagPropertis = await BlogModel.findById(tagId, "Tag")
            if (tagPropertis.data.length <= 0) {
                message = msgConfig.notFoundMsgs._noTag;
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message)
            }
            req.body.tagId = tagPropertis.data[0].id
            req.body.tagBlongToUserId = tagPropertis.data[0].userId
            req.body.tagBlongToPostId = tagPropertis.data[0].postId

            return next()
        }

    } catch (err) {
        console.log("THIS IS FROM ADMINDELETETAGVALIDATION MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}


exports.adminDeleteCatValidation = async (req, res, next) => {
    try {
        // 1) Get Category By Id Or Value
        const {
            currentCategory,
            categoryId
        } = req.body
        // Find By Value
        if (currentCategory !== undefined) {
            if (currentCategory === "") {
                message = msgConfig.badRequestesMsgs._hasNotEnterCategory;
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.badRequestesMsgs._badRequestStatusCode, message);
            }
            const catPropertis = await BlogModel.findOne('Category', "", 'category', currentCategory)
            if (catPropertis.data.length <= 0) {
                message = msgConfig.notFoundMsgs._noCategory;
                return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                    msgConfig.notFoundMsgs._notFoundStatusCode, message)
            }
            if (catPropertis.data[0].category === "پیش فرض") {
                message = msgConfig.badRequestesMsgs._defualtCategory;
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.badRequestesMsgs._badRequestStatusCode, message)
            }
            req.body.catId = catPropertis.data[0].id
            req.body.catBlongToUserId = catPropertis.data[0].userId
            req.body.catBlongToPostId = catPropertis.data[0].postId

            return next()
        } else
            // Find By CategoryId
            if (categoryId !== undefined) {
                const catPropertis = await BlogModel.findById(categoryId, "Category")
                if (catPropertis.data.length <= 0) {
                    message = msgConfig.notFoundMsgs._noComment;
                    return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                        msgConfig.notFoundMsgs._notFoundStatusCode, message)
                }
                req.body.catId = catPropertis.data[0].id
                req.body.catBlongToUserId = catPropertis.data[0].userId
                req.body.catBlongToPostId = catPropertis.data[0].postId

                return next()
            }

    } catch (err) {
        console.log("THIS IS FROM ADMINDELETECATEGORYVALIDATION MIDDLEWARE CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}