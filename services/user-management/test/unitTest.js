require("mocha");
const axios = require("axios");
const assert = require("assert")
const redisDb = require("../../captcha/db/redisDb")



let baseUsersUrl = "http://localhost:8080/api/v1/users"
let baseAdminUrl = "http://localhost:8080/api/v1/admin"
let captchaUrl = "http://localhost:8080/api/v1/captcha/generate"
// Test For Login User Api 
describe("Test Login Api /login", () => {
    let captchaToken;
    let captchaValue;
    //* First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captcha => {
            captchaToken = captcha.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
    })
    //* Test Login 
    describe("Login User Into Application", () => {
        it("Should Login User And Send Back Success Status", async () => {
            await axios({
                method: "post",
                url: baseUsersUrl + "/login",
                data: {
                    email: "fortest@example.com",
                    password: "test12345",
                    captchaToken,
                    captchaValue
                }
            }).then(res => {
                // Assertetion
                assert.strictEqual(res.data.status, "success")
            }).catch(err=>{
               assert.fail(err.response.data.response)
            })
        })
    })
})


//  Test For Login User Api 
describe("Test Get Users Api /login", () => {
    // To Get List Of Users We Need To Login As Admin 
    let captchaToken;
    let captchaValue;
    let userToken;
    //* First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captcha => {
            captchaToken = captcha.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        await axios({
            method: "post",
            url: baseUsersUrl + "/login",
            data: {
                email: "admin@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).then(loginResult => {
            userToken = loginResult.data.data.token
        })
    })
    //* Test Login 
    describe("Get List Of Users", () => {
        it("Should Get List Of Users And Send Back Success Status", async () => {
            console.log("userToken" ,userToken);
            await axios({
                method: "get",
                url: baseUsersUrl,
                headers: {
                    authorization: `Bearer ${userToken}`
                }
            }).then(res => {
                // Assertetion
                console.log(res.data.status);
                assert.strictEqual(res.data.status, "success")
            }).catch(err => {
                console.log(err);
                assert.fail(err.response)
            })
        })
    })
})

// *******************************************************************************

// Test For Register User Into Application
describe("Test Register Api ./register", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let userId ;
    // First Get Captcha From Captcha Api For Send With Other Information
    // Test Registeration
    describe("Register New User Into Applcation", () => {
        it("Send Back Success Status", async () => {
            await axios({
                method: "get",
                url: captchaUrl
            }).then(async captchaResult => {
                captchaToken = captchaResult.data.status.token
                captchaValue = await redisDb.get(captchaToken)
            })
            await axios({
                method: "post",
                url: baseUsersUrl + "/register",
                data: {
                    firstname: "testName",
                    lastname: "tesLastName",
                    email: "test@example.com",
                    password: "test12345",
                    passwordConfirm: "test12345",
                    captchaToken,
                    captchaValue,
                }
            }).then(res => {
                // Assertetion
                console.log("Res Data",res.data);
                assert.strictEqual(res.data.status, "success")
            }).catch(err=>{
                assert.fail(err.response.data.response) ; 
            })
        })
    })
    // Then Delete User Who We Created With Test Registeration
    after(async () => {
        await axios({
            method: "get",
            url: captchaUrl 
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // First Login As Admin For Delete User Who We Created With Registeration
        await axios({
            method: "post",
            url: baseUsersUrl + "/login",
            data: {
                email: "admin@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).then(loginResult => {
            userToken = loginResult.data.data.token
        })
        // Then Get User Who We Registered To Application With His Email
        await axios({
            method: "get",
            url: baseUsersUrl + "?email=test@example.com",
            headers: {
                authorization: `Bearer ${userToken}`
            }
        }).then(result=>{
            userId = result.data.data[0].userId
        })
         // Then Delete Him From App
        await axios({
            method: "delete",
            url: baseAdminUrl + "/users",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data:{
                userId
            }
        })
    })
})

// ************************************************************************************

//Test For Update User Password
describe("Test UpdatePassword Api /updatepassword" , ()=>{
    let captchaToken ; 
    let captchaValue ;
    let userToken ;
    // First Get Captcha From Captcha Api For Send With Other Information And Login As Test User And Update Password
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        await axios({
            method: "post",
            url: baseUsersUrl + "/login",
            data: {
                email: "fortest@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).then(loginResult => {
            userToken = loginResult.data.data.token  
        }).catch(err=>{
            assert.fail(err.response.data.response)
        })
    })
    // Update Test User Password
    describe("Update User Password" , ()=>{
        it("Send Back Success Status" ,async ()=>{
            await axios({
                method: "put" , 
                url : baseUsersUrl + "/user/updatePassword",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data:{
                    currentPass : "test12345",
                    newPass : "test123451"
                }
            }).then(result=>{
                // Assertation
                assert.strictEqual(result.data.status , "success")
            }).catch(err=>{
                assert.fail(err.response.data.response)
            })
        })
    })
    // Then Restore The Data To Its Original Values
    after(async()=>{
        await axios({
            method: "put" , 
            url : baseUsersUrl + "/user/updatePassword",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data:{
                currentPass :"test123451",
                newPass : "test12345"
            }
        }).catch(err=>{
            assert.fail(err.response.data.response)
        })
    })
})

// *************************************************************************************************

// Test For Update Profile 
describe("Test Update Profile Api /updateme" , ()=>{
    let captchaToken;
    let captchaValue;
    let userToken;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl 
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        //Login As Test User And Update Firstname/Lastname/Email
        await axios({
            method: "post",
            url: baseUsersUrl + "/login",
            data: {
                email: "fortest@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).then(loginResult => {
            userToken = loginResult.data.data.token  
        }).catch(err=>{
            assert.fail(err.response.data.response)
        })
    })
    //Test Update User Information
    describe("Update User Profile" , ()=>{
        it("Should Return Success Status" , async()=>{
            await axios({
                method: "put" , 
                url : baseUsersUrl + "/user",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data:{
                    firstname :"testName" , 
                    lastname : "testLastname" 
                }
            }).then(result=>{
                // Assertation
                assert.strictEqual(result.data.status , "success")
            }).catch(err=>{
                assert.fail(err.response.data.response)
            })
        })
    })
    // Then Restore The Data To Its Original Values 
    after(async()=>{
        await axios({
            method: "put" , 
            url : baseUsersUrl + "/user",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data:{
                firstname :"fortest" , 
                lastname : "fortest" , 
            }
        }).catch(err=>{
            assert.fail(err.response.data.response)
        })
    })
})

// ********************************************************************************************************

// Test For DeActive User Account
describe("Test For DeActive User Account" , ()=>{
    let captchaToken;
    let captchaValue;
    let userToken;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl 
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        //Login As Test User And Update Firstname/Lastname/Email
        await axios({
            method: "post",
            url: baseUsersUrl + "/login",
            data: {
                email: "fortest@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).then(loginResult => {
            userToken = loginResult.data.data.token
        }).catch(err=>{
            assert.fail(err.response.data.response) ;
        })
    })
    // Test Deactive User Account
    describe("DeActive User Account" ,()=>{
        it("Should Return Success Status" , async()=>{
            await axios({
                method: "delete" , 
                url : baseUsersUrl + "/user",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
            }).then(result=>{
                // Assertation
                assert.strictEqual(result.data.status , "success")
            }).catch(err=>{
                assert.fail(err.response.data.response) ;
            })
        })
    })
    // Then Restore The Data To Its Original Values Use Api Login
    // For User To Active His Account Just Need Login Into Application
    after(async()=>{
        await axios({
            method: "get",
            url: captchaUrl 
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        await axios({
            method: "post",
            url: baseUsersUrl + "/login",
            data: {
                email: "fortest@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).catch(err=>{
            assert.fail(err.response.data.response) ;
        })
    })
})

// ********************************************************************************************

// Tets Admin Apis
describe("Test For Create Admin" , ()=>{
    let captchaToken;
    let captchaValue;
    let userToken;
    let userId ;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl 
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Admin
        await axios({
            method: "post",
            url: baseUsersUrl + "/login",
            data: {
                email: "admin@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).then(loginResult => {
            userToken = loginResult.data.data.token
        }).catch(err=>{
            assert.fail(err.response.data.response) ;
        })
    })
    // Test Create Admin Account
    describe("Create An Admin" ,()=>{
        it("Should Return Success Status" , async()=>{
            await axios({
                method: "post" , 
                url : baseAdminUrl + "/users",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data:{
                    email : "testadmin@example.com" ,
                    password: "test12345"
                }
            }).then(result=>{
                // Assertation
                assert.strictEqual(result.data.status , "success")
            }).catch(err=>{
                assert.fail(err.response.data.response) ;
            })
        })
    })
    // Then Restore The Data To Its Original Values Use Api Login
    // For User To Active His Account Just Need Login Into Application
    after(async()=>{
        await axios({
            method: "get",
            url: baseUsersUrl + "?email=testadmin@example.com",
            headers: {
                authorization: `Bearer ${userToken}`
            }
        }).then(result=>{
            userId = result.data.data[0].userId
        })
        await axios({
            method: "delete",
            url: baseAdminUrl + "/users",
            headers : {
                authorization : `Bearer ${userToken}`
            },
            data: {
                userId
            }
        }).catch(err=>{
            assert.fail(err.response.data.response) ;
        })
    })
})


describe("Test For Delete User As Admin", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let userId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Create A User
        await axios({
            method: "post",
            url: baseUsersUrl + "/register",
            data: {
                firstname: "testName",
                lastname: "tesLastName",
                email: "test@example.com",
                password: "test12345",
                passwordConfirm: "test12345",
                captchaToken,
                captchaValue,
            }
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        // We Need Get Captcha Again
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Admin
        await axios({
            method: "post",
            url: baseUsersUrl + "/login",
            data: {
                email: "admin@example.com",
                password: "test12345",
                captchaToken,
                captchaValue
            }
        }).then(loginResult => {
            userToken = loginResult.data.data.token
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        // Get User Who We Created 
        await axios({
            method: "get",
            url: baseUsersUrl + "?email=test@example.com",
            headers: {
                authorization: `Bearer ${userToken}`
            }
        }).then(result => {
            userId = result.data.data[0].userId
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
    })
    // Then Delete Him | Test For Delete User (Admin)
    describe("Test Delete User Api As An Admin", () => {
        it("Should Return Success Status", async () => {
            await axios({
                method: "delete",
                url: baseAdminUrl + "/users",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    userId
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.status, 204)
            }).catch(err => {
                assert.fail(err.response.data.response);
            })
        })
    })
})