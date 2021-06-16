exports.addPost = (postObj, userId, blogId) => {
    return `WITH first_insert AS (
    INSERT INTO posts (title , "blogId" , body , "createdAt") VALUES
    ('${postObj.title}' , '${blogId}' , '${postObj.body}' , '${postObj.createdAt}')
    RETURNING id
    ),
    second_insert AS (
        INSERT INTO tags ("userId" , "postId" , tag)
        VALUES (${userId} , (SELECT id FROM first_insert) , '${postObj.tags}') RETURNING id
        )
        INSERT INTO categori ( "userId" ,"postId",category)
        VALUES
        (${userId} ,(SELECT id FROM first_insert), '${postObj.category}')
        RETURNING (SELECT id FROM first_insert) AS postId ,
        (SELECT id FROM second_insert) AS tagId ,
        id AS categoryId  `
}

exports.getTitle = (title) => {
    return `SELECT * FROM posts WHERE title='${title}'`
}

exports.findPosts = () => {
    return `SELECT P.title , P.body  , P."createdAt" ,
    U.firstname AS authorFn , U.lastname AS authorLn , U."isActive" AS ActiveUser  ,
        B."blogName" AS authorBlogName ,
            array_agg(distinct T.tag) AS tags,
               array_agg(DISTINCT Ca.category) AS category ,
                       array_agg(DISTINCT Co.message) AS comments
          FROM  posts AS P
     INNER JOIN blogs AS B ON P."blogId"=B.id
     LEFT JOIN tags AS T ON P.id = T."postId"
     LEFT JOIN categori AS Ca ON P.id = Ca."postId"
     LEFT JOIN comments AS Co ON P.id = Co."postId"
     INNER JOIN users AS U ON B."userId" =U."userId"
         GROUP BY P.id , U.firstname , U.lastname , B."blogName" , U."isActive"`
}

exports.findForbiddenWords = () => {
    return `SELECT  F.word  FROM forbidenwords AS F`
}

exports.findWeblogs = () => {
    return `SELECT w."blogName" , w."status" , u.firstname AS authorFname , u.lastname AS authorLname  FROM blogs AS w 
    INNER JOIN users AS u ON w."userId" = u."userId"`
}

exports.findPostById = (id) => {
    return `SELECT P.* , array_agg(distinct T.tag) AS tags , array_agg(DISTINCT Ca.category) AS category ,
            U.firstname as authorFn , U.lastname as authorLn
          FROM  posts AS P
            INNER JOIN blogs AS B ON P."blogId"=B.id
            LEFT JOIN tags AS T ON P.id = T."postId"
            LEFT JOIN categori AS Ca ON P.id = Ca."postId"
            INNER JOIN users AS U ON B."userId" =U."userId" WHERE P.id =${id}
            GROUP BY P.id , U.firstname , U.lastname`
}
exports.findPostsByProperty = (propValue) => {
    return `SELECT P.title , P.body  , P."createdAt" ,
    U.firstname AS authorFn , U.lastname AS authorLn ,
        B."blogName" AS authorBlogName ,
            array_agg(distinct T.tag) AS tags,
               array_agg(DISTINCT Ca.category) AS category ,
                    array_agg(DISTINCT Co.message) AS "comments"
          FROM  posts AS P
     INNER JOIN blogs AS B ON P."blogId"=B.id
     LEFT JOIN tags AS T ON P.id = T."postId"
     LEFT JOIN comments AS Co ON P.id = Co."postId"
     INNER JOIN categori AS Ca ON P.id = Ca."postId"
     INNER JOIN users AS U ON B."userId" =U."userId" WHERE U."isActive"='${propValue}'
         GROUP BY P.id , U.firstname , U.lastname , B."blogName"`
}
exports.filterPostsByCategory = (CatValue) => {
    return `SELECT p.title AS postTitle , p.body AS postbody ,u.firstname AS authorName ,
    array_agg(DISTINCT Co.message) AS comments  ,array_agg(DISTINCT t.tag) AS tags FROM categori AS c
    INNER JOIN posts AS p ON c."postId" = p.id
    left JOIN tags AS t ON p.id  = t."postId" 
    left JOIN comments AS Co ON p.id = Co."postId"
    INNER JOIN users AS u ON c."userId" = u."userId"
    WHERE c.category= '${CatValue}'
    GROUP BY p.title , p.body ,u.firstname`

}
exports.findPostByWeblogId = (blogId) => {
    return `SELECT P.* , array_agg(distinct T.tag) AS tags , array_agg(DISTINCT C.category) AS category ,
    array_agg(distinct Co.message) AS comments FROM posts AS P
                INNER JOIN blogs AS B ON P."blogId" = B.id
                LEFT JOIN tags AS T ON P.id = T."postId"
                LEFT JOIN categori AS C ON P.id = C."postId"
                LEFT JOIN comments AS Co ON P.id = Co."postId"
                WHERE B.id =${blogId} GROUP BY P.id`
}


exports.findWeblogById = (id) => {
    return `SELECT B.* , U.firstname , U.lastname  FROM blogs AS B
    INNER JOIN users AS U ON B."userId" = U."userId"
     WHERE B.id=${id}`
}

exports.findWeblogByUserId = (userId) => {
    return `SELECT B.* , U.firstname , U.lastname  FROM blogs AS B
    INNER JOIN users AS U ON B."userId" = U."userId"
    WHERE U."userId"=${userId}`
}


exports.findCommentById = (id) => {
    return `SELECT C.* , U.firstname , U.lastname  FROM comments AS C
            INNER JOIN users AS U ON C."userId" = U."userId"
            INNER JOIN posts AS P ON C."postId" = P.id
            WHERE C.id=${id}`
}
exports.findCommentByMessage = (message) => {
    return `SELECT Co.* FROM comments Co WHERE Co.message ='${message}'`
}


exports.findCatagoryById = (id) => {
    return `SELECT Ca.* , U.firstname , U.lastname  FROM categori AS Ca
    INNER JOIN users AS U ON Ca."userId" = U."userId"
    INNER JOIN posts AS P ON Ca."postId" = P.id
     WHERE Ca.id=${id}`
}
exports.findCatByPostId = (propValue, postId) => {
    return `SELECT C.* FROM categori AS C WHERE C.category='${propValue}' AND C."postId" ='${postId}'`
}
exports.findCatByProperty = (propValue) => {
    return `SELECT C.* FROM categori C WHERE C.category ='${propValue}'`

}


exports.findTagByPostId = (postId) => {
    return `SELECT T.* FROM tags AS T WHERE T."postId" =${postId}`
}
exports.findTagById = (id) => {
    return `SELECT T.* , U.firstname , U.lastname  FROM tags AS T
    INNER JOIN users AS U ON T."userId" = U."userId"
    INNER JOIN posts AS P ON T."postId" = P.id
     WHERE T.id=${id}`
}
exports.findTagByProperty = (propValue) => {
    return `SELECT T.* FROM tags T WHERE T.tag ='${propValue}'`
}


exports.findForbiddenWordByValue = (propValue) => {
    return `SELECT F.word FROM forbidenwords F  WHERE F.word ='${propValue}'`

}
exports.deletePostById = (id) => {
    return `DELETE FROM posts WHERE id =${id}`
}
exports.deleteTagById = (id) => {
    return `DELETE FROM tags WHERE id=${id}`
}
exports.deleteCatById = (id) => {
    return `DELETE FROM categori WHERE id=${id}`
}
exports.deleteCommentById = (id) => {
    return `DELETE FROM comments WHERE id=${id}`
}
exports.deleteBlogById = (id) => {
    return `DELETE FROM blogs WHERE id=${id}`
}