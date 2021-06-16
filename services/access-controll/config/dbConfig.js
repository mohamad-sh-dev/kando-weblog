let ACPG_CON;

if(process.env.NODE_ENV === "development"){
    ACPG_CON = {
        host     : '37.152.182.214',
        port     : '5432' , 
        user     : process.env.PGDB_USERNAME , 
        password : process.env.PGDB_PASSWORD , 
        database :process.env.PGDB_DATABASENAME, 
        ssl : true
    }
}


module.exports = {ACPG_CON} ;

