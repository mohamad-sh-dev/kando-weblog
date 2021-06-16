const axios = require("axios");

class User {

    constructor(
        // firstname = "testname",
        // lastname = "testLname",
        // email = "test@example.com",
        // signupAt = "2012/01/01",
        // password = "testPassword") {
    ) {
        // this._firstname = firstname;
        // this._lastname = lastname;
        // this._email = email;
        // this._signupAt = signupAt;
        // this._password = password;
        this._adminToken = process.env.ADMIN_TOKEN
        this._axiosDbBaseUrl = 'http://localhost:8080/api/v1/db/users';
        this._axiosAclBaseUrl = 'http://localhost:8080/accesscontroll/api/v1';
    }
    // Use In getUsers Handdler
    async getUsers() {
        try {
            const result = await axios({
                method: "get",
                url: this._axiosDbBaseUrl,
                headers:{
                    authorization : `Bearer ${this._adminToken}`
                }
            })
            // Handdle Query Errors
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err.response
        }

    }
    // Use In Most Middlewares
    async checkEmail(email) {
        try {
            const result = await axios({
                method: "get",
                url: this._axiosDbBaseUrl + `/email?email=${email}`,
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
            })
            // Handdle Query Errors
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err
        }
    }
    // Use In Register User Handdler
    async registerUser(firstname, lastname, email, password, signupAt) {
        const user = {
            firstname,
            lastname,
            email,
            role: "bloger",
            password,
            signupAt,
        }
        try {
            const result = await axios({
                method: 'post',
                url: this._axiosDbBaseUrl + '/register',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    user
                }
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err
        }
    }
    // Use In Register Handdle Create Role For New User
    async createRole(userId, roleName) {
        try {
            const result = await axios({
                method: 'post',
                url: this._axiosAclBaseUrl + '/assignRole',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    userId,
                    roleName
                }
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err
        }
    }
    // Use For updateMe/updatePassword And deActive Handdlers
    async findByIdAndUpdate(id, operation, updateObj) {
        try {
            const result = await axios({
                method: 'put',
                url: this._axiosDbBaseUrl + '/user',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: typeof updateObj === "object" ? {
                    id,
                    updateObj,
                    operation
                } : {
                    id,
                    operation
                }
            })
            if (typeof result.data === "string") throw result.data
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Use For deleteUser In Admin Controller
    async findByIdAndDelete(id) {
        try {
            const result = await axios({
                method: 'delete',
                url: this._axiosDbBaseUrl + '/user',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    id
                }
            })
            if (typeof result.data === "string") throw result.data
            return result;
        } catch (err) {
            throw err
        }
    }
    async updatePassword(password, id) {
        try {
            const result = await axios({
                method: 'put',
                url: this._axiosDbBaseUrl + '/updatepassword',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    password,
                    id
                }
            })
            if (typeof result.data === "string") throw result.data
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Use In Register User Handdler 
    async createBlogForEachBloger(id) {
        const tableName = "blogs"
        try {
            const result = await axios({
                method: 'post',
                url: this._axiosDbBaseUrl + '/createblog',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    tableName,
                    id
                }
            })
            if (typeof result.data === "string") throw result.data
            return result;
        } catch (err) {
            throw err;
        }
    }
    // Use In Most Middlewares And Handdlers
    async getUserById(id) {
        try {
            const result = await axios({
                method: "get",
                url: this._axiosDbBaseUrl + `/getUserById?id=${id}`,
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
    // Use In Admin Controller For Create New Admin
    async createAdmins(email, password, createdAt) {
        try {
            const result = await axios({
                method: 'post',
                url: this._axiosDbBaseUrl + '/createadmin',
                headers : {
                    authorization : `Bearer ${this._adminToken}`
                },
                data: {
                    email,
                    password,
                    createdAt,
                }
            })
            if (typeof result.data === "string") throw result.data
            return result
        } catch (err) {
            throw err
        }
    }

}
module.exports = User