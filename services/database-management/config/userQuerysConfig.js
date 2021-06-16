exports.emailExists = (email) => {
    return `SELECT * FROM users WHERE users."email"='${email}'`
}
exports.getAllUsers = () => {
    return `SELECT * FROM users`
}
exports.findById = (id) => {
    return `SELECT U.* ,R.name roleName FROM users U
	right  JOIN  assignroletouser artu ON U."userId" = artu."userId"
    RIGHT JOIN  roles R ON artu."roleId" = R."roleId" WHERE U."userId" =${id}
    GROUP BY U."userId" , R.name`
}
exports.register = (userObj) => {
    return `INSERT INTO users (firstname , lastname ,email , PASSWORD , "signupAt") VALUES
    ('${userObj.firstname}' ,'${userObj.lastname}' ,'${userObj.email}','${userObj.password}','${userObj.signupAt}')
     RETURNING users."userId" AS id`
}
exports.createBlogForUser = (id) => {
    return `INSERT INTO blogs ("userId") VALUES (${id})`
}
exports.findByIdAndDelete = (id) => {
    return `DELETE FROM users AS U WHERE U."userId"=${id}`
}
exports.updatePassword = (password, id) => {
    return `UPDATE users AS U SET PASSWORD='${password}' WHERE U."userId" = ${id}`
}
exports.createAdmin = (password, email, createdAt) => {
    return`INSERT INTO users (email , PASSWORD ,"signupAt") VALUES
    ('${email}','${password}','${createdAt}')
    RETURNING users."userId" AS id`
}
exports.createTable = () => {
    return `CREATE TABLE users (
            userId INT(10) NOT NULL AUTO_INCREMENT,
            firstname VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
            lastname VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
            role ENUM('guest','admin','bloger') NULL DEFAULT 'guest' COLLATE 'utf8mb4_0900_ai_ci',
            email VARCHAR(200) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
            password VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
            randomLoginToken INT(10) NULL DEFAULT NULL,
            isActive TINYINT(3) NULL DEFAULT '1',
            isRegistered TINYINT(3) NULL DEFAULT '0',
            signupAt DATE NULL DEFAULT NULL,
            PRIMARY KEY (userId) USING BTREE,
            UNIQUE INDEX email_UNIQUE (email) USING BTREE,
            UNIQUE INDEX randomLoginToken_UNIQUE (randomLoginToken) USING BTREE
        )
        COLLATE='utf8mb4_0900_ai_ci'
        ENGINE=InnoDB
        AUTO_INCREMENT=0`;
}