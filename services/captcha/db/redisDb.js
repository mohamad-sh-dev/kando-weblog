const redis = require("redis");
const {promisify} = require("util");

// Create Clinet Use Redis Module
const client = redis.createClient();
// Handdle Get For checkCaptcha Function 
exports.get = promisify(client.get).bind(client);
// Handdle Set And Bind To Client For createCaptcha Function 
exports.setex = promisify(client.setex).bind(client);
// Handdle Delete 
exports.delete = promisify(client.del).bind(client);