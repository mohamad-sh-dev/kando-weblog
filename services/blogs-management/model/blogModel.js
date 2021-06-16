const axios = require("axios")

class Blog {
    constructor() {
        this._adminToken = process.env.ADMIN_TOKEN
        this._axiosMethod = "post"
        this._axiosBlogsBaseUrl = "http://localhost:8080/api/v1/db/blogs" // request to db service 
    }
    async CheckTitle(title) {
        try {
            const result = await axios({
                method: 'get',
                url: this._axiosBlogsBaseUrl + `/posts/title?title=${title}`,
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err;
        }

    }
    // Find All Posts
    async find(resource = "Posts") {
        try {
            const result = await axios({
                method: 'get',
                url: this._axiosBlogsBaseUrl + `/getAll?resource=${resource}`,
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err
        }

    }
    // Find Resource By Id
    async findById(id, resource = "Post") {
        try {
            const result = await axios({
                method: 'get',
                url: this._axiosBlogsBaseUrl + `/findById?id=${id}&resource=${resource}`,
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err;
        }
    }
    async addPost(userId, blogId, title,
        body,
        createdAt,
        category,
        tags,
    ) {
        const id = userId;
        const blogid = blogId;
        const newPost = {
            title,
            body,
            createdAt,
            category,
            tags
        }
        //console.log(newPost.createdAt);
        try {
            const result = await axios({
                method: 'post',
                url: this._axiosBlogsBaseUrl + '/posts',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    id,
                    blogid,
                    newPost,
                }
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err;
        }

    }
    async findOne(resource = "Post", id, prop, propValue, findBy) {
        // console.log("propValuepropValuepropValuepropValue",propValue);
        try {
            // let query;
            // if (findBy === undefined) {
            //     query = `?resource=${resource}&prop=${prop}&propValue=${propValue}&id=${id}`
            // } else {
            //     query = `?findBy=${findBy}&resource=${resource}&prop=${prop}&propValue=${propValue}&id=${id}`
            // }
            const result = await axios({
                method: 'post',
                url: this._axiosBlogsBaseUrl + '/findOne',
                headers: {
                    authorization: `Bearer ${this._adminToken}`
                },
                data: {
                    resource,
                    id,
                    prop,
                    propValue,
                    findBy
                }
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err;
        }
    }

    async updateById(resource = "Post", id, updatePropertisOBJ) {
        if (typeof updatePropertisOBJ !== "object") return false;
        // console.log(updatePropertisOBJ);
        if (resource === "Blog" || resource === "Post") {
            updatePropertisOBJ
        }
        // updatePropertis = {
        //     title: this._title,
        //     body: this._body,
        //     category: this._category,
        //     tags: this._tags,
        //     updatedAt: this._updatedAt
        // }
        try {
            const result = await axios({
                method: 'put',
                url: this._axiosBlogsBaseUrl + '/posts',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    resource,
                    id,
                    updatePropertisOBJ,
                }
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err;
        }
    }

    async deleteById(resource = "Post", id) {
        try {
            const result = await axios({
                method: 'delete',
                url: this._axiosBlogsBaseUrl + '/posts',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    resource,
                    id,
                }
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err;
        }
    }

    async updateOne(action, prop, propValue,
        propId = 0, userId = 0, postId = 0) {
        try {
            const result = await axios({
                method: 'put',
                url: this._axiosBlogsBaseUrl + '/posts/updateOne',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    action,
                    prop,
                    propValue,
                    propId,
                    userId,
                    postId,
                }
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Blog