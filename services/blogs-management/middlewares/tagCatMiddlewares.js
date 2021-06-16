const Blog = require("../model/blogModel")
const BlogModel = new Blog()
const msgConfig = require("../config/msgConfig")
// const axios = require("axios")

let message;
exports.tagAndCateditValidation = async (req, res, next) => {
    const {
        currentTag,
        currentCategory,
    } = req.body
    const {
        userId
    } = req.user[0]
    if (currentCategory !== undefined) {
        if (req.body.title || req.body.body || req.body.tags || req.body.currentTag) {
            message = msgConfig.badRequestesMsgs._cantEditFromHere_Tag;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        } else
            // No Current Cat | Send Error
            if (currentCategory === "") {
                message = msgConfig.badRequestesMsgs._hasNotEnterCategory;
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.badRequestesMsgs._badRequestStatusCode, message);
            }
        const catPropertis = await BlogModel.findOne('Category', "", 'category', currentCategory)
        if (catPropertis.data.length <= 0) {
            message = msgConfig.notFoundMsgs._noCategory
            return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                msgConfig.notFoundMsgs._notFoundStatusCode, message)
        }
        const catBelongToUser = catPropertis.data.find(c => {
            return c.userId === userId
        })
        if (!catBelongToUser) {
            message = msgConfig.badRequestesMsgs._cantEditOrDeleteCategory;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        if (catBelongToUser.category === "پیش فرض") {
            message = msgConfig.badRequestesMsgs._defualtCategory;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        // console.log("catBelongToUser" , catBelongToUser);
        req.body.catId = catBelongToUser.id
        return next()
    }
    if (currentTag !== undefined) {
        if (req.body.title || req.body.body || req.body.category || req.body.currentCategory) {
            message = msgConfig.badRequestesMsgs._cantEditFromHere_Tag
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        }
        // No Current Tags | Send Error
        if (currentTag === "") {
            message = msgConfig.badRequestesMsgs._hasNotEnterTag
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        }
        const tagPropertis = await BlogModel.findOne('Tag', "", 'tags', currentTag)
        if (tagPropertis.data.length <= 0) {
            message = msgConfig.notFoundMsgs._noTag
            return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                msgConfig.notFoundMsgs._notFoundStatusCode, message)
        }
        const tagBelongToUser = tagPropertis.data.find(c => {
            return c.userId === userId
        })
        if (!tagBelongToUser) {
            message = msgConfig.badRequestesMsgs._cantEditOrDeleteTag;
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        req.body.tagId = tagBelongToUser.id
        return next()
    }
}