const {
    connection
} = require("../utils/dbConection")
const {
    addPost,
    getTitle,
    findPosts,
    findWeblogs,
    findForbiddenWords,
    findPostById,
    findWeblogById,
    findCommentById,
    findTagById,
    findCatagoryById,
    findPostByWeblogId,
    findWeblogByUserId,
    findTagByPostId,
    findCatByPostId,
    findPostsByProperty,
    findTagByProperty,
    findCatByProperty,
    filterPostsByCategory,
    findCommentByMessage,
    findForbiddenWordByValue,
    deletePostById,
    deleteTagById,
    deleteBlogById,
    deleteCatById,
    deleteCommentById
} = require("../config/postsQuerysCongif");


exports.addPost = (req, res) => {
    try {
        const newPost = req.body.newPost;
        const blogId = req.body.blogid
        const userId = req.body.id;
        const query = addPost(newPost, userId, blogId)
        connection.query(query, (err, result) => {
            if (err) {
                return res.end(JSON.stringify(err.stack));
            }
            res.end(JSON.stringify(result.rows));
        })
    } catch (err) {
        res.end(JSON.stringify(err.stack));
    }

}

exports.getTitle = (req, res) => {
    const {
        title
    } = req.query
    const query = getTitle(title)
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.find = (req, res) => {
    try {
        let query;
        const {
            resource
        } = req.query
        if (resource === "Posts") {
            query = findPosts()
        } else if (resource === "Blog") {
            query = findWeblogs()
        } else if (resource === "ForbidenWords") {
            query = findForbiddenWords()
        }
        connection.query(query, (err, result) => {
            if (err) {
                return res.end(JSON.stringify(err.stack))
            }
            res.end(JSON.stringify(result.rows))
        })
    } catch (err) {
        res.end(JSON.stringify(err.stack))
    }
}

exports.findById = (req, res) => {
    try {
        let query;
        const {
            id,
            resource
        } = req.query
        if (resource === "Post") {
            query = findPostById(id)
        } else if (resource === "Blog") {
            query = findWeblogById(id)
        } else if (resource === "Comment") {
            query = findCommentById(id)
        } else if (resource === "Tag") {
            query = findTagById(id)
        } else if (resource === "Category") {
            query = findCatagoryById(id)
        }
        connection.query(query, (err, result) => {
            if (err) {
                return res.end(JSON.stringify(err.stack))
            }
            res.end(JSON.stringify(result.rows))
        })
    } catch (err) {
        res.end(JSON.stringify(err.stack))
    }
}

exports.findOne = (req, res) => {
    try {
        let query;
        const {
            findBy,
            resource,
            prop,
            propValue,
            id
        } = req.body
        if (findBy) {
            if (resource === "Post" && findBy === "BlogId") {
                query = findPostByWeblogId(id)
            } else if (resource === "Blog" && findBy === "UserId") {
                query = findWeblogByUserId(id)
            } else if (resource === "Tags" && findBy === "PostId") {
                query = findTagByPostId(id)
            } else if (resource === "Category" && findBy === "PostId") {
                query = findCatByPostId(propValue, id)
            }
        } else {
            if (resource === "Post" && prop === "isActive") {
                query = findPostsByProperty(propValue)
            } else if (resource === "Blog" && prop === "categoryAndTag") {
                query = `SELECT w."blogName" , w."status" ,
                array_agg(distinct t.tag) AS tags , array_agg(distinct c.category) AS categorys  FROM blogs AS w 
					INNER   JOIN posts AS p ON w.id = p."blogId"
			   LEFT JOIN  categori AS c ON p.id = c."postId"
               LEFT JOIN  tags AS t ON p.id = t."postId"
               WHERE w.id = ${id}
               GROUP BY w."blogName" , w."status"`
            } else if (resource === "Tag" && prop === "tags") {
                query = findTagByProperty(propValue)
            } else if (resource === "Category" && prop === "category") {
                query = findCatByProperty(propValue)
            } else if (resource === "Category" && prop === "posts") {
                query = filterPostsByCategory(propValue)
            } else if (resource === "Comment" && prop === "messages") {
                query = findCommentByMessage(propValue)
            } else if (resource === "ForbidenWord" && prop === "word") {
                query = findForbiddenWordByValue(propValue);
            }
        }
        connection.query(query, (err, result) => {
            if (err) {
                return res.end(JSON.stringify(err.stack))
            }
            res.end(JSON.stringify(result.rows))
        })
    } catch (err) {
        res.end(JSON.stringify(err.stack))
    }
}

exports.updateById = (req, res) => {
    try {
        let query;
        const {
            resource,
            id
        } = req.body
        if (resource === "Post") {
            const {
                title,
                body,
                category,
                tag,
                updatedAt
            } = req.body.updatePropertisOBJ
            query = `UPDATE tags SET tag='${tag}' WHERE tags."postId" =${id}; 
            UPDATE categori SET category='${category}' WHERE categori."postId"=${id} ; 
            UPDATE posts SET title='${title}',body='${body}',"updatedAt"='${updatedAt}' WHERE posts.id =${id}`
        } else if (resource === "Blog") {
            const {
                blogName
            } = req.body
            query = `UPDATE blogs SET "blogName"='${blogName}' WHERE id =${id}`
        }
        connection.query(query, (err, result) => {
            if (err) {
                return res.end(JSON.stringify(err.stack))

            }
            res.end(JSON.stringify(result))
        })
    } catch (err) {
        res.end(JSON.stringify(err.stack))
    }

}

exports.updateOne = (req, res) => {
    try {
        let query;
        const {
            action,
            prop,
            propValue,
            propId,
            userId,
            postId
        } = req.body
        if (action === "Edit" && prop === "addComment") {
            query = `UPDATE posts SET "addComment"='${propValue}' WHERE id=${postId}`
        } else
        if (action === "Edit" && prop === "tags") {
            query = `UPDATE tags SET tag='${propValue}' WHERE id=${propId}`
        } else
        if (action === "Add" && prop === "tags") {
            query = `INSERT INTO tags ("userId" ,"postId" , tag)
             VALUES ('${userId}', '${postId}', '${propValue}') RETURNING id`
        } else
        if (action === "Edit" && prop === "category") {
            query = `UPDATE categori SET category='${propValue}' WHERE id=${propId}`
        } else
        if (action === "Add" && prop === "category") {
            query = `INSERT INTO categori ("userId" ,"postId" , category)
            VALUES ('${userId}', '${postId}', '${propValue}') RETURNING id `
        } else
        if (action === "Add" && prop === "comment") {
            query = `INSERT INTO comments ("userId" ,"postId" , message)
            VALUES ('${userId}', '${postId}', '${propValue}') RETURNING id `
        } else
        if (action === "Edit" && prop === "comments") {
            query = `UPDATE comments SET message='${propValue}' WHERE id=${propId}`
        }
        connection.query(query, (err, result) => {
            if (err) {
                return res.end(JSON.stringify(err.stack))
            }
            res.end(JSON.stringify(result.rows))
        })
    } catch (err) {
        res.end(JSON.stringify(err.stack))
    }
}

exports.deleteById = (req, res) => {

    try {
        let query;
        const {
            resource,
            id
        } = req.body;
        if (resource === "Post") {
            query = deletePostById(id)
        } else
        if (resource === "Blog") {
            query = deleteBlogById(id)
        } else
        if (resource === "Tag") {
            query = deleteTagById(id)
        } else
        if (resource === "Category") {
            query = deleteCatById(id)
        } else
        if (resource === "Comments") {
            query = deleteCommentById(id)
        }
        connection.query(query, (err, result) => {
            if (err) {
                return res.end(JSON.stringify(err.stack))
            }
            res.end(JSON.stringify(result))
        })
    } catch (err) {
        res.end(JSON.stringify(err.stack))
    }
}