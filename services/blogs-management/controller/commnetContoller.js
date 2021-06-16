const Blog = require("../model/blogModel")
const blogModel = new Blog()
const msgConfig = require("../config/msgConfig")

exports.editCommentStatus = async (req, res) => {
  try {
    const {
      postId
    } = req.body
    const findStatusAction = await blogModel.findById(postId, "Post")
    const addCmSituation = findStatusAction.data[0].addComment
    if (addCmSituation === true) {
      await blogModel.updateOne("Edit", "addComment", "false", "", "", postId)
      message = msgConfig.successMsgs._deActiveComment;
      return res.send(msgConfig.successMsgs._successMsg,
        msgConfig.successMsgs._successStatusCode, message)
    }
    if (addCmSituation === false) {
      await blogModel.updateOne("Edit", "addComment", "true", "", "", postId)
      message = msgConfig.successMsgs._activeComment;
      return res.send(msgConfig.successMsgs._successMsg,
        msgConfig.successMsgs._successStatusCode, message)
    }
  } catch (err) {
    console.log("THIS IS FROM EDITCMSTATUS HANDLLER CATCH ERR", err); // For Developer
    message = msgConfig.internalServerErr._internalServerErr
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }
}

exports.addcommnet = async (req, res) => {
  try {
    const {
      postId,
      comment,
      user = req.user[0]
    } = req.body
    await blogModel.updateOne("Add", "comment", comment, "", user.userId, postId)
    message = msgConfig.successMsgs._addComment;
    res.send(msgConfig.successMsgs._successMsg, msgConfig.successMsgs._successCreateStatusCode, message)
  } catch (err) {
    console.log("THIS IS FROM ADDCM HANDLLER CATCH ERR", err); // For Developer
    message = msgConfig.internalServerErr._internalServerErr;
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }
}

exports.editComment = async (req, res) => {
  try {
    let {
      updateComment,
      cmId,
    } = req.body
    // 2) Call updateOne Method And Set Properties | Handdle Errors
    await blogModel.updateOne("Edit", "comments", updateComment, cmId)
    // Send Response
    message = msgConfig.successMsgs._editComment;
    res.send(msgConfig.successMsgs._successMsg,
      msgConfig.successMsgs._successStatusCode, message);
  } catch (err) {
    console.log("THIS IS FROM EDITCM HANDLLER CATCH ERR", err); // For Developer
    message = msgConfig.internalServerErr._internalServerErr;
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }
}

exports.deleteComment = async (req, res) => {
  try {
    const cmId = req.body.cmId;
    await blogModel.deleteById("Comments", cmId)
    res.send(msgConfig.successMsgs, msgConfig.deleteStatusCode._deleteStatusCode)
  } catch (err) {
    console.log("THIS IS FROM DELETECM HANDLLER CATCH ERR", err); // for developer
    message = msgConfig.internalServerErr._internalServerErr;
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }
}