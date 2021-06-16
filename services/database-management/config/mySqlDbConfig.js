let MYSQL_CON;


if(process.env.NODE_ENV === "development"){
    MYSQL_CON = {
        host     : "localhost" ,
        port     : "3306" , 
        user     : 'root',
        password : "mohamad25437" ,
        database : "kando-weblog"
    }
}

// specified database when we want publish our project 
if((process.env.NODE_ENV === "production")){
    MYSQL_CON = {
        host     : 'Dynamic Url', // enter weblog dynamic url 
        port     : "3306" , 
        user     : 'root',
        password :process.env.DB_PASSWORD,
        database :"cactus"
    }
}


module.exports = {MYSQL_CON} ;

