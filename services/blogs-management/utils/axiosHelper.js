const axios = require("axios")

exports.sendRequest = () => {
    return async function (url, method, data, token) {
        try {
            return await axios({
                method: method,
                url: url,
                headers: {
                    authorization: `Bearer ${token}`
                },
                data: data
            })
        } catch (err) {
            return err.response
        }
    }
}