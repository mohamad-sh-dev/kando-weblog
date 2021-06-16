const {
    sendStatusCodeAndSetHeader
} = require("kando-utils")
const jwt = require("jsonwebtoken");
const {
    connection
} = require("../utils/dbConection")
const axios = require("axios")



exports.protect = async (req, res, next) => {
    try {
        let token;
        let message;
        // Check token from request
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        // if token not exist return false
        if (!token || token === "null") {
            message = "شما وارد نشدید،لطفا برای دسترسی ابتدا وارد حساب کاربری خود شوید"
            sendStatusCodeAndSetHeader(res, "fail", 401, message, null)
            return;
        }
        // verify token with our SECRET_KEY
        const decoded = jwt.verify(token, process.env._JWT_SECRET_KEY)
        // Token verifyed and find user with our User model methods
        const query = `SELECT U.* ,R.name roleName FROM users U
        right  JOIN  assignroletouser artu ON U."userId" = artu."userId"
        RIGHT JOIN  roles R ON artu."roleId" = R."roleId" WHERE U."userId" =${decoded.payload}
        GROUP BY U."userId" , R.name`
        const currentUser =(await connection.query(query)).rows
        // console.log(currentUser);
        //if token expired or user no longer exist return false
        if (currentUser.length <= 0) {
            message = "توکن شما منقضی شده است یا این کاربر دیگر در دسترس نمیباشد"
            sendStatusCodeAndSetHeader(res, "fail", 401, message, null)
            return;
        }
        // get access if all conditions true and set req.user to current user for access in whole application functions
        delete currentUser[0].password
        delete currentUser[0].signupAt
        req.user = currentUser;
        next()
    } catch (err) {
        console.log("THIS IS FROM PROTECTDATABASE MIDDLEWARE CATCH ERR", err);
        throw err
    }
}


exports.checkAccess = async (req, res, next) => {
    try {
        let message;
    const AcUrl = "http://localhost:8080/accesscontroll/api/v1/getPermision"
    const {
        method,
        url,
        user
    } = req;
    await axios({
        method: 'post',
        url: AcUrl,
        headers : {
            authorization : req.headers.authorization
        },
        data: {
            method,
            url,
            user
        }
    }).then(result => {
        console.log("Check Access Middleware", result.data);
        next()
    }).catch(err => {
        console.log(err);
        if (err.response.data.status === "not found") {
            message = err.response.data.response;
            return res.send(err.response.data.status, 404, message)
        }
        if(err.response.data.status === "fail"){
            message = err.response.data.response;
            return res.send(err.response.data.status, 400, message)
        }
        message = "دسترسی به این بخش برای شما مقدور نمیباشد";
        console.log("ERROR", err.response.data);
        return res.send("fail", 403, message)
    })
    } catch (err) {
        console.log("THIS IS FROM CHECKACCESSDATABASE MIDDLEWARE CATCH ERR", err);
        throw err
    }
}


// exports.protectDb = async (req, res, next) => {
//     if (!req.body.token) {
//         let token;
//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1]
//         }
//         // if token not exist return false
//         if (!token || token === "null") {
//             message = "شما وارد نشدید،لطفا برای دسترسی ابتدا وارد حساب کاربری خود شوید"
//             sendStatusCodeAndSetHeader(res, "fail", 403, message, null)
//             return;
//         }
//         // verify token with our SECRET_KEY
//         let decoded = jwt.verify(token, process.env._JWT_SECRET_KEY)
//         // Token verifyed and find user with our User model methods
//         const query = `SELECT U.* ,R.name roleName FROM users U
//         right  JOIN  assignroletouser artu ON U."userId" = artu."userId"
//         RIGHT JOIN  roles R ON artu."roleId" = R."roleId" WHERE U."userId" =${decoded.payload}
//         GROUP BY U."userId" , R.name` 
//         let currentUser =(await connection.query(query)).rows
//         if (currentUser.length <= 0) {
//             message = "توکن شما منقضی شده است یا این کاربر دیگر در دسترس نمیباشد"
//             sendStatusCodeAndSetHeader("fail", 400, message, null)
//             return;
//         }
//         if (currentUser[0].rolename !== "admin") {
//             message = "دسترسی شما به این بخش مجاز نمیباشد";
//             return res.send("fail", 403, message);
//         }
//         req.user = currentUser;
//         return next()
//     }
//     let decoded = jwt.verify(req.body.token, process.env._JWT_SECRET_KEY)
//     // Token verifyed and find user with our User model methods 
//     const query = `SELECT U.* ,R.name roleName FROM users U
//     right  JOIN  assignroletouser artu ON U."userId" = artu."userId"
//     RIGHT JOIN  roles R ON artu."roleId" = R."roleId" WHERE U."userId" =${decoded.payload}
//     GROUP BY U."userId" , R.name` 
//     let currentUser =(await connection.query(query)).rows
//     //console.log( "this is from authorize",  currentUser);
//     //if token expired or user no longer exist return false 
//     if (currentUser.length <= 0) {
//         throw new Error("DbProtect No User Found");
//     }
//     if (currentUser[0].rolename !== "admin") {
//         // console.log(currentUser.rolename);
//         message = "No Access For This User !!";
//         return res.send("fail", 403, message)
//     }
//     req.body.token = undefined;
//     return next()

// }