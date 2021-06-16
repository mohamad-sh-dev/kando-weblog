function search(api, operation, Object) {
    if (Object.api !== api || Object.operation !== operation) {
        return false
    } else {
        return true
    }

}
module.exports = {
    search
}