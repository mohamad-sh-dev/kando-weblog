const Blog = require("../model/blogModel");
let blogModel = new Blog()
const {
  convertDate
} = require("kando-utils")
const msgConfig = require("../config/msgConfig")
let message;

exports.getAllPosts = async (req, res) => {
  try {
    if (!req.postsForAdmin) {
      // Search By Category
      if (req.query.filterByCatagory) {
        const {
          filterByCatagory
        } = req.query
        let result = await blogModel.findOne("Category", "", "posts", filterByCatagory)
        if (result.data.length <= 0) {
          message = msgConfig.notFoundMsgs._noPostWithCat
          return res.send(msgConfig.notFoundMsgs._notFoundMsg,
            msgConfig.notFoundMsgs._notFoundStatusCode, message)
        }
        const posts = result.data.map(post => {
          if (post.tags[0] === null) {
            post.tags = []
          }
          if (post.comments[0] === null) {
            post.comments = []
          }
          return JSON.parse(JSON.stringify(post))
        });
        message = `Results :${result.data.length}`
        return res.send(msgConfig.successMsgs._successMsg,
          msgConfig.successMsgs._successStatusCode, message, posts)
      }
      let result = await blogModel.findOne("Post", "", "isActive", "true")

      // no error then send response to client
      if (result.data.length <= 0) {
        message = msgConfig.notFoundMsgs._noPosts;
        return res.send(msgConfig.notFoundMsgs._notFoundMsg,
          msgConfig.notFoundMsgs._notFoundStatusCode, message)
      }
      const posts = result.data.map(post => {
        if (post.tags[0] === null) {
          post.tags = []
        }
        if (post.comments[0] === null) {
          post.comments = []
        }
        return JSON.parse(JSON.stringify(post))
      });
      message = `Results :${result.data.length}`
      return res.send(msgConfig.successMsgs._successMsg,
        msgConfig.successMsgs._successStatusCode, message, posts)
    }
    let posts = req.postsForAdmin
    message = `Results :${posts.length}`
    res.send(msgConfig.successMsgs._successMsg,
      msgConfig.successMsgs._successStatusCode, message, posts)
    // handdle unknown errors
  } catch (err) {
    console.log("THIS IS FROM GETALLPOSTS HANDLLER CATCH ERR", err); // for developer
    message = msgConfig.internalServerErr._internalServerErr
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }

}

// Add Post
exports.addPost = async (req, res) => {
  // 1)  Get Post Propertis From Body
  try {
    const userId = req.user[0].userId
    let {
      title,
      body,
      tag,
      category,
      createdAt,
    } = req.body
    if (!category || category === undefined) {
      category = "پیش فرض"
    }
    // 2) Create New Model And Set Propertis
    const findBlogId = await blogModel.findOne("Blog", userId, "", "", "UserId")

    const blogId = findBlogId.data[0].id;
    // 3) Call addPost Method | Handlle | Add Post Accesses For Author
    const newPost = await blogModel.addPost(userId, blogId, title, body, createdAt, category, tag)

    const postdata = newPost.data[0]
    message = msgConfig.successMsgs._addPostMsg
    res.send(msgConfig.successMsgs._successMsg,
      msgConfig.successMsgs._successCreateStatusCode, message, postdata)

  } catch (err) {
    console.log("THIS IS FROM ADDPOST HANDLLER CATCH ERR", err); // for developer
    message = "مشکلی به وجود امده است لطفا مجددا تلاش نمایید";
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    // Find User BlogId For Get Posts Belong To It || Use findOne Method And Set "Blog" Resource
    const userId = req.user[0].userId;
    const userBlog = await blogModel.findOne("Blog", userId, "", "", "UserId")
    const blogId = userBlog.data[0].id;
    // Use findOne Again Method And Set "Post" Resource And Set BlogId
    const post = await blogModel.findOne("Post", blogId, "", "", "BlogId")
    // No Post Exist
    if (post.data.length <= 0) {
      message =msgConfig.notFoundMsgs._noUserPost
      return res.send(msgConfig.notFoundMsgs._notFoundMsg,
        msgConfig.notFoundMsgs._notFoundStatusCode, message);
    }
    // Handdle Null Comments Tags Send All Bloger Posts
    message = msgConfig.successMsgs._findPosts
    const posts = post.data.map(post => {
      if (post.tags[0] === null) {
        post.tags = []
      } else
      if (post.comments[0] === null) {
        post.comments = []
      }
      return JSON.parse(JSON.stringify(post))
    });
    res.send(msgConfig.successMsgs._successMsg,
      msgConfig.successMsgs._successStatusCode, message, posts);
  } catch (err) {
    console.log("THIS IS FROM GETMYPOST HANDLLER CATCH ERR", err); // For Developer
    message = "مشکلی به وجود امده است لطفا مجددا تلاش نمایید";
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }
}
// Handdle Edit Post
exports.editPost = async (req, res) => {
  try {
    // 1) First Need Find Post
    const {
      postId
    } = req.body

    let updatePropertisOBJ = {
      title,
      body,
      category,
      tag,
    } = req.body
    updatePropertisOBJ.updatedAt = convertDate(new Date),
      // 3) Call updateById Method And Set Post Id
      await blogModel.updateById("Post", postId, updatePropertisOBJ)

    message = msgConfig.successMsgs._editPostSuccessMsg
    res.send(msgConfig.successMsgs._successMsg,
      msgConfig.successMsgs._successStatusCode, message)
  } catch (err) {
    console.log("THIS IS FROM EDITPOST HANDLLER CATCH ERR", err); // For Developer
    message = "مشکلی به وجود امده است لطفا مجددا تلاش نمایید";
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }
}
// Handdle Delete Post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.post.id
    await blogModel.deleteById("Post", postId)
    res.send(msgConfig.successMsgs._successMsg, msgConfig.deleteStatusCode._deleteStatusCode)
  } catch (err) {
    console.log("THIS IS FROM DELETEPOST HANDLLER CATCH ERR", err); // for developer
    message = "مشکلی به وجود امده است لطفا مجددا تلاش نمایید";
    res.send(msgConfig.badRequestesMsgs._failMsg, 500, message)
  }
}