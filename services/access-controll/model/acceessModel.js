const {
    connection
} = require("../utils/dbConnection")

class AccessControll {
    constructor() {
        this.axiosMethod = "post";
        this.axiosUrl = "http://localhost:8080/api/v1/db/accessControll/peremision"
    }
    async findUser(id) {
        try {
            const query = `SELECT U.* ,R.name roleName FROM users U
            right  JOIN  assignroletouser artu ON U."userId" = artu."userId"
            RIGHT JOIN  roles R ON artu."roleId" = R."roleId" WHERE U."userId" =${id}
            GROUP BY U."userId" , R.name`
            const result = await connection.query(query)
            return result.rows
        } catch (err) {
            return err.stack
        }
    }
    async assignRole(userId , roleName) {
        // console.log("userId", userId ,"roleName",roleName);
        try {
            const query = `INSERT INTO AssignRoleToUser ("userId" , "roleId") VALUES ('${userId}' ,
            (SELECT R."roleId" FROM roles AS R WHERE R.name ='${roleName}'))`
            const result = await connection.query(query)
            return result.rows
        } catch (err) {
            throw err.stack
        }
    }
    async searchForAc (api){
        try {
            const query = `SELECT ACap.api , ACap."apiId"  , ACop."operationId" , R.name AS roleName FROM ac AS AC
            INNER join acoperations AS ACop ON AC."operationId" = ACop."operationId"
            INNER JOIN acapi AS ACap ON AC."apiId" = ACap."apiId"
            INNER JOIN roles AS R ON ac."roleId" = R."roleId"
            WHERE ACap.api ='${api}'`
            const result = await connection.query(query)
            return result.rows
        } catch (err) {
            throw err.stack
        }
    }
    async findUserRole(userId) {
        try {
            const query = `SELECT ar.* , r.name FROM AssignRoleToUser ar
            INNER JOIN roles r ON ar."roleId" = r."roleId"  WHERE ar."userId"='${userId}'`
            const result = await connection.query(query)
            return result.rows
        } catch (err) {
            throw err.stack
        }
    }
    async getPermisions(userRoleName , url) {
        try {
            const query = `SELECT ac."roleId" AS RoleId , ac.id acId ,  ACop.operation , R.name AS acRoleName ,
            U."userId" , U.firstname , U.lastname  ,
                    ACap."api" FROM ac AS AC
            INNER join acoperations AS ACop ON AC."operationId" = ACop."operationId"
            LEFT  JOIN roles R ON ac."roleId" = R."roleId"
            LEFT  JOIN assignroletouser AS acr ON acr."roleId" = R."roleId"
            INNER JOIN users AS U ON acr."userId" = U."userId"
             INNER JOIN acapi AS ACap ON AC."apiId" = ACap."apiId" WHERE R.name ='${userRoleName}' OR ACap."api"='${url}'
				GROUP BY U."userId" , R.name  , ac."roleId" , ac.id ,ACop.operation  ,ACap."api"`
            const result = await connection.query(query)
            return result.rows
        } catch (err) {
            throw err.stack
        }
    }
    async addAccess(api, operation, roleName) {
        try {
            const query = `WITH first_insert AS (
                INSERT INTO acoperations (operation) VALUES
              ('${operation}')
                RETURNING acoperations."operationId" AS id
             ),
             second_insert AS (
                 INSERT INTO acapi (api , "operationId")
                  VALUES ('${api}' , (SELECT id FROM first_insert))
                  RETURNING acapi."apiId" AS id
             ),
             third_action AS (
             	SELECT  R."roleId" FROM roles R
    				WHERE R.name ='${roleName}'
				 )
             INSERT INTO ac ("roleId","operationId","apiId")
             VALUES
             ((SELECT "roleId" FROM third_action) ,(SELECT id FROM first_insert),(SELECT id FROM second_insert))`
            const result = await connection.query(query);
            return result
        } catch (err) {
            throw err.stack
        }
    }
    async addRoleToExistApi(operationId , apiId , role){
        try {
            const query = `INSERT INTO ac ("operationId" , "apiId" , "roleId")
             VALUES ('${operationId}' , '${apiId}' ,
            (SELECT R."roleId" FROM roles AS R WHERE R.name = '${role}'))`
            const result = await connection.query(query);
            return result
        } catch (err) {
            throw err.stack
        }




    }
    async RmoveRoleFromExistApi(operationId , apiId , role){
        try {
            const query = `INSERT INTO ac ("operationId" , "apiId" , "roleId")
             VALUES ('${operationId}' , '${apiId}' ,
            (SELECT R."roleId" FROM roles AS R WHERE R.name = '${role}'))`
            const result = await connection.query(query);
            return result
        } catch (err) {
            throw err.stack
        }




    }
    async deleteAccess(api,roleName) {
        try {
            const query = `DELETE FROM acoperations AS ao USING acapi , ac  , roles
            WHERE ao."operationId" = acapi."operationId"
             AND ao."operationId" = ac."operationId"
             AND acapi."apiId" = ac."apiId"
             AND acapi.api ='${api}'
             AND roles.name='${roleName}'`
            const result = await connection.query(query);
            return result
        } catch (err) {
            throw err.stack
        }
    }
    async getAllAccesses(){
        try {
            const query = `SELECT A."roleId" , A.id AS AcID ,ACO.operation ,
            AP.api AS api ,R.name AS roleName , U.firstname AS userFn, U."userId"
             FROM ac AS A
                        INNER JOIN acapi AS AP ON A."apiId" = AP."apiId"
                        INNER JOIN acoperations AS ACO ON A."operationId" = ACO."operationId"
                        INNER JOIN roles AS R ON A."roleId"  = R."roleId"
                        INNER JOIN assignroletouser AS acr ON R."roleId" = acr."roleId"
                        INNER JOIN users AS U ON acr."userId" = U."userId"
                        ORDER BY acid`
            const result = await connection.query(query)
            return result.rows
        } catch (err) {
            throw err.stack
        }
    }
}

module.exports = AccessControll