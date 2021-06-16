const Blog = require("../model/blogModel");
let blogModel = new Blog()
const msgConfig = require("../config/msgConfig");

let message;
exports.getAllWeblogs = async (req, res) => {
    try {
        const result = await blogModel.find("Blog")

        const blogs = result.data.map(b => {
            if (b.status === true) {
                b.status = "active"
            }
            return JSON.parse(JSON.stringify(b))
        });
        message = msgConfig.successMsgs._findBlogs;
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message, blogs)
    } catch (err) {
        console.log("THIS IS FROM getAllWeblogs HANDLLER CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }

}

exports.userBlog = async (req, res) => {
    try {
        const userId = req.user[0].userId
        const result = await blogModel.findOne("Blog", userId, "", "", "UserId")

        // Dont Have Err  | Delete UserId And Send User Weblog Information In Response
        delete result.data[0].userId
        if (result.data[0].status === true) {
            result.data[0].status = "active"
        }
        const finalResult = result.data[0]
        message = msgConfig.successMsgs._findBlog
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message, finalResult)
        // Handdle Unknown Errors
    } catch (err) {
        console.log("THIS IS FROM GETUSERBLOG HANDLLER CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }

}
exports.getAllCategorysAndTagsInBlog = async (req, res) => {
    try {
        const {
            blogId
        } = req.query
        if (!blogId) {
            message = msgConfig.badRequestesMsgs._hasNotEnterBlogId
            return res.send(msgConfig.badRequestesMsgs._failMsg,
                msgConfig.badRequestesMsgs._badRequestStatusCode, message);
        }
        const result = await blogModel.findOne("Blog", blogId, "categoryAndTag", "")

        message = msgConfig.successMsgs._findAllCategorysAndTagsInBlog
        res.send(msgConfig.successMsgs._successMsg,
            msgConfig.successMsgs._successStatusCode, message, result.data[0])
    } catch (err) {
        console.log("THIS IS FROM getAllCategorysAndTagsInBlog HANDLLER CATCH ERR", err); // For Developer
        message = msgConfig.internalServerErr._internalServerErr;
        res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
    }

}