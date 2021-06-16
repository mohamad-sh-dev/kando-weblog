require("mocha");
const axios = require("axios");
const assert = require("assert")
const redisDb = require("../../captcha/db/redisDb")


let baseUrl = "http://localhost:8080/api/v1/users"
let captchaUrl = "http://localhost:8080/api/v1/captcha/generate"
let baseAcUrl = "http://localhost:8080/accesscontroll/api/v1"
// Test For Get Permision User Api 
describe("Test getpermision Api /getpermision", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    //* First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        // console.log("befor");
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captcha => {
            captchaToken = captcha.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        }).catch(err => {
            console.log(err);
        })
        await axios({
            method: "post",
            url: baseUrl + "/login",
            data: {
                email: "admin@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).then(r => {
            userToken = r.data.data.token
        }).catch(err => {
            console.log(err);
        })
        console.log(userToken);
        await axios({
            method: 'post',
            url: baseAcUrl +  '/admin',
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                api: "/api/v1/thisIsTestApi",
                operation: "TEST",
                role: "admin",
            }
        })
    })
    //* Test  Get Permision
    describe("Get Permision For User", () => {
        it("Should Get User To Acccess And Send Back Grant Status", async () => {
            await axios({
                method: "post",
                url: baseAcUrl + "/getPermision" ,
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    user:[{
                        userId: 138,
                        rolename: "admin"
                    }],
                    method: "TEST",
                    url: "/api/v1/thisIsTestApi"
                }
            }).then(res => {
                // Assertetion
                console.log(res.data);
                assert.strictEqual(res.data.status, "Grant")
            }).catch(err => {
                console.log(err.response.data);
                assert.fail(err.response.data.response)
            })
        })
    })
    after(async () => {
        // Deleted It With DeleteAccess Api
        await axios({
            method: "delete",
            url: baseAcUrl + "/admin" ,
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data :{
                api: '/api/v1/thisIsTestApi' , 
                role: "admin" , 
            }
        })

    })

})

