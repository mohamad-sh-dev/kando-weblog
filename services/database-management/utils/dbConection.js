const {Pool} = require("pg");
const {
    PG_CON
} = require("../config/postgreSqlDbConfig")


const connection = new Pool(PG_CON)

connection.connect(() => {
    console.log(`Database Connected On host : ${connection.options.host}`);
})

module.exports = {connection} ;

// const mysql = require("mysql");
// const {
//     MYSQL_CON
// } = require("../config/dbConfig")

// const connection = mysql.createConnection(MYSQL_CON)

// connection.connect(()=>{
//     console.log(`Database Connencted`);
// });

// module.exports = connection;