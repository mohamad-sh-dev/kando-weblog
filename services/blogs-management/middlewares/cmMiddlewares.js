const Blog = require("../model/blogModel")
const BlogModel = new Blog();
const msgConfig = require("../config/msgConfig");


exports.ckeckAccessToCmUseUserId = async (req, res, next) => {
    const {
        currentComment
    } = req.body
    const {
        userId
    } = req.user[0]
    if (currentComment !== undefined) {
        if (req.body.title || req.body.body || req.body.category || req.body.tags) {
            message = msgConfig.badRequestesMsgs._cantEditFromHere_comment
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        } else
            // No Current Cm | Send Error
            if (currentComment === "") {
                message = msgConfig.badRequestesMsgs._hasNotEnterComment
                return res.send(msgConfig.badRequestesMsgs._failMsg,
                    msgConfig.badRequestesMsgs._badRequestStatusCode, message);
            }
        const cmPropertis = await BlogModel.findOne('Comment', "", 'messages', currentComment)
        if (cmPropertis.data.length <= 0) {
            message = msgConfig.notFoundMsgs._noComment
            return res.send(msgConfig.notFoundMsgs._notFoundMsg,
                msgConfig.notFoundMsgs._notFoundStatusCode, message)
        }
        const cmBelongToUser = cmPropertis.data.find(c => {
            return c.userId === userId
        })
        if (!cmBelongToUser) {
            message = msgConfig.badRequestesMsgs._cantEditOrDeleteComment
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message)
        }
        req.body.cmId = cmBelongToUser.id
        return next()
    }
}