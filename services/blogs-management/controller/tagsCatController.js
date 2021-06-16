const Blog = require("../model/blogModel")
const BlogModel = new Blog()
const msgConfig = require("../config/msgConfig")
let message;

exports.addTags = async (req, res) => {
    try {
        // 1) Get Tag And PostID From Client
        const {
            tag,
            postId,
            userId = req.user[0].userId
        } = req.body
        // Insert Tags Into Post | Add Accesses For Delete/Edit Tag
        await BlogModel.updateOne("Add", 'tags', tag, '', userId, postId)
        message = msgConfig.successMsgs._addTagSuccessMsg
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM ADDTAGS HANDLLER CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.editTags = async (req, res) => {
    try {
        // 1) Get Update Tags Values
        let {
            updateTag,
            tagId,
        } = req.body
        // 2) Call updateOne Method And Set Properties | Handdle Errors
        await BlogModel.updateOne("Edit", "tags", updateTag, tagId)
        // Send Response
        message = msgConfig.successMsgs._editTagSuccessMsg;
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message);
    } catch (err) {
        console.log("THIS IS FROM EDITTAGS HANDLLER CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.deleteTag = async (req, res) => {
    try {
        const tagId = req.body.tagId;
        await BlogModel.deleteById("Tag", tagId)
        res.send(msgConfig.successMsgs._successMsg, 204)
    } catch (err) {
        console.log("THIS IS FROM DELETETAG HANDLLER CATCH ERR", err); // for developer
        message = msgConfig.internalServerErr.internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.addCategory = async (req, res) => {
    try {
        const {
            category,
            postId,
            userId = req.user[0].userId
        } = req.body
        await BlogModel.updateOne("Add", 'category', category, '', userId, postId)
        message = msgConfig.successMsgs._addCatSuccessMsg;
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message)
    } catch (err) {
        console.log("THIS IS FROM ADDCATEGORY HANDLLER CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.editCategory = async (req, res) => {
    try {
        let {
            updateCategory,
            catId
        } = req.body
        await BlogModel.updateOne("Edit", "category", updateCategory, catId)
        // Send Response
        message = msgConfig.successMsgs._editCatSuccessMsg;
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message);
    } catch (err) {
        console.log("THIS IS FROM EDITCATEGORY HANDLLER CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const catId = req.body.catId;
        await BlogModel.deleteById("Category", catId)
        res.send(msgConfig.successMsgs._successMsg, 204)

    } catch (err) {
        console.log("THIS IS FROM DELETECATEGORY HANDLLER CATCH ERR", err); // for developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }
}