const Blog = require("../../model/blogModel");
let BlogModel = new Blog()
const msgConfig = require("../../config/msgConfig");
let msg;

exports.deletePost = async (req, res) => {
    try {
        const {
            postId
        } = req.body
        await BlogModel.deleteById("Post", postId)
        res.send(msgConfig.successMsgs._successMsg, msgConfig.deleteStatusCode._deleteStatusCode)
    } catch (err) {
        console.log("THIS IS FROM ADMINCONTROLLER DELETEPOST HANDLLER CATCH ERR", err); // for developer
        msg = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, msg)
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const {
            catId,
        } = req.body;
        await BlogModel.deleteById("Category", catId)
        res.send(msgConfig.successMsgs._successMsg, msgConfig.deleteStatusCode._deleteStatusCode)
    } catch (err) {
        console.log("THIS IS FROM ADMINDELETECATEGORY HANDLLER CATCH ERR", err); // for developer
        msg = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, msg)
    }
}


exports.deleteTag = async (req, res) => {
    try {
        const {
            tagId
        } = req.body;
        await BlogModel.deleteById("Tag", tagId)
        res.send(msgConfig.successMsgs._successMsg, msgConfig.deleteStatusCode._deleteStatusCode)
    } catch (err) {
        console.log("THIS IS FROM ADMINDELETETAG HANDLLER CATCH ERR", err); // for developer
        msg = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, msg)
    }
}
exports.deleteComment = async (req, res) => {
    try {
        const {
            cmId,
        } = req.body;
        await BlogModel.deleteById("Comments", cmId)
        res.send(msgConfig.successMsgs._successMsg, msgConfig.deleteStatusCode._deleteStatusCode)
    } catch (err) {
        console.log("THIS IS FROM ADMINCONTROLLERDELETECOMMENT HANDLLER CATCH ERR", err); // for developer
        msg = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, msg)
    }
}