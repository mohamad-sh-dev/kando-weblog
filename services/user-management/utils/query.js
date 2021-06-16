const connection = require("../controller/dbController");

async function execute(Query) {
    const promise = new Promise((resolve, reject) => {
        connection.query(Query, (err, result) => {
            if (err) {
                reject(err)
                return err;
            }else{
                resolve(result)
                return result ;
            }
        })
    })
   return await promise;
}

module.exports = {execute}