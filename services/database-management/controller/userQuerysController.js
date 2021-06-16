const {
    connection
} = require("../utils/dbConection");
const {
    emailExists,
    getAllUsers,
    findById,
    register,
    updatePassword,
    createAdmin,
    createTable,
    createBlogForUser,
    findByIdAndDelete
} = require("../config/userQuerysConfig")

exports.getAllUsers = (req, res) => {
    const query = getAllUsers()
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.findById = (req, res) => {
    const id = req.query.id
    const query = findById(id)
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.register = (req, res) => {
    const {
        user
    } = req.body ;
    const query = register(user) ;
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })

}

exports.emailExist = (req, res) => {
    const {
        email
    } = req.query;
    const query = emailExists(email)
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.createTable = (req, res) => {
    const query = createTable()
    connection.query(query, (err, result) => {
        if (err) {
            res.end(JSON.stringify(err))
        }
        res.end(JSON.stringify(result))
    })
}

exports.createBlogForUser = (req, res) => {
    const id = req.body.id
    const query = createBlogForUser(id)
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.findByIdAndDelete = (req, res) => {
    const id = req.body.id
    const query = findByIdAndDelete(id)
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.updatePassword = (req, res) => {
    const password = req.body.password
    const id = req.body.id
    const query = updatePassword(password , id)
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.createAdmin = (req, res) => {
    const {
        email,
        password,
        createdAt
    } = req.body;
    const query = createAdmin(password, email , createdAt);
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}

exports.findByIdAndUpdate = (req, res) => {
    let query;
    const operation = req.body.operation;
    const id = req.body.id;
    if (operation === "update") {
        const updateUser = req.body.updateObj
        query = `UPDATE users SET ${updateUser.firstname ? `firstname='${updateUser.firstname}',` : " "}
        ${updateUser.lastname ? `lastname='${updateUser.lastname}',` : " "}
        ${updateUser.email ? `email='${updateUser.email}',` : " "} "isActive"='true' WHERE users."userId"=${id}`
    } else if (operation === "deActive") {
        query = `UPDATE users AS U SET "isActive"='false' WHERE U."userId" = ${id}`
    } else if (operation === "active") {
        query = `UPDATE users AS U SET "isActive"='true' WHERE U."userId" = ${id}`
    } else if (operation === "changePassword") {
        const {
            password
        } = req.body.updateObj
        query = `UPDATE users AS U SET PASSWORD='${password}' WHERE U."userId" = ${id}`
    }
    connection.query(query, (err, result) => {
        if (err) {
            return res.end(JSON.stringify(err.stack))
        }
        res.end(JSON.stringify(result.rows))
    })
}
