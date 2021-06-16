let PG_CON;

if(process.env.NODE_ENV === "development"){
    PG_CON = {
        host     : '37.152.182.214',
        port     : '5432' , 
        user     : process.env.PGDB_USERNAME , 
        password : process.env.PGDB_PASSWORD , 
        database :process.env.PGDB_DATABASENAME, 
        ssl : true
    }
}

// specified database when we want publish our project 
if((process.env.NODE_ENV === "production")){
    PG_CON = {
        host     : "",
        port     : "" , 
        user     : "" , 
        password : "" , 
        database : ""
    }
}


module.exports = {PG_CON} ;

