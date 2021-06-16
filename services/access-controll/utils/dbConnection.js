const {Pool} = require("pg");
const {
    ACPG_CON
} = require("../config/dbConfig")

const connection = new Pool(ACPG_CON)

connection.connect(() => {
    console.log(`Access Controll Service Connect To Database On host : ${connection.options.host}`);
})

module.exports = {connection} ;

