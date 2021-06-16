const {
    sendRequest
} = require("./axiosHelper");

class AddAccesses {
    constructor(
        acAddAndDeleteAccessUrl = 'http://localhost:8080/accesscontroll/api/v1/admin',
        acAddAccessMethod = "post",
        acDelelteAccessMethod = 'delete'
    ) {
        this._acAddAccessUrl = acAddAndDeleteAccessUrl;
        this._acDeleteAccessUrl = acAddAndDeleteAccessUrl;
        this._acAddAccessMethod = acAddAccessMethod;
        this._acDelelteAccessMethod = acDelelteAccessMethod
        this._adminToken = process.env.ADMIN_TOKEN ;
    }

    async addAccess(arrayRequestes) {
        try {
            const token = this._adminToken
            for (var i = 0; i < arrayRequestes.length; i++) {
                await sendRequest()(this._acAddAccessUrl, this._acAddAccessMethod, {
                    api: arrayRequestes[i].api,
                    role: arrayRequestes[i].role,
                    operation: arrayRequestes[i].operation
                },token)
            }
        } catch (err) {
            console.log('this is from ADD', err);
            throw err
        }
    }
    async deleteAccess(arrayRequestes){
        try {
            const token = this._adminToken
            for (var i = 0; i < arrayRequestes.length; i++) {
                await sendRequest()(this._acDeleteAccessUrl, this._acDelelteAccessMethod, {
                    api: arrayRequestes[i].api,
                    role: arrayRequestes[i].role,

                },token)
            }
        } catch (err) {
            console.log('this is from DEL', err);
            throw err
        }
    }
}

module.exports = AddAccesses