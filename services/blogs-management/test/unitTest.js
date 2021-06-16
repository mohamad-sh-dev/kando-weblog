require("mocha");
const axios = require("axios");
const assert = require("assert")
const redisDb = require("../../captcha/db/redisDb")



let baseBlogsUrl = "http://localhost:8080/api/v1/weblogs"
let baseUsersUrl = "http://localhost:8080/api/v1/users"
let captchaUrl = "http://localhost:8080/api/v1/captcha/generate"
//Test For Get All Posts Api 
describe("Test Get All Post Api /posts", () => {
    describe("Find All Posts Inside Application", () => {
        it("Should Get All Users Posts And Send Back Success Status", async () => {
            await axios({
                method: "get",
                url: baseBlogsUrl + "/posts",
            }).then(res => {
                // Assertetion
                // console.log(res.data);
                assert.strictEqual(res.data.status, "success")
            }).catch(err => {
                // console.log(err);
                assert.fail(err.response.data.response)
            })
        })
    })
})

// ******************************************

describe("Test Add Post Api /userWeblog/posts", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
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
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
    //Test Update User Information
    describe("Add Post In Aplication", () => {
        it("Should Return Success Status", async () => {
            await axios({
                method: "post",
                url: baseBlogsUrl + "/userWeblog/posts",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    title: "5متن تست",
                    body: "متن تست متن تست",
                    tags: "#تستتگ"
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.data.status, "success")
                postId = result.data.data.postid
            }).catch(err => {
                assert.fail(err.response.data.response)
            })
        })
    })
    // Then Delete Post Who We Created 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// *****************************

// Test For Get My Posts
describe("Test Get My Post Api /userWeblog/posts", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
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
        }).catch(err => {
            console.log(err.response);
            assert.fail(err.response)
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tags: "#تستتگ"
            }
        }).then(result => {
            // Assertation
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })
    })

    describe("Get My Posts", () => {
        it("Send Back Success Status", async () => {
            await axios({
                method: "get",
                url: baseBlogsUrl + "/userWeblog/posts",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
            }).then(result => {
                // Assertation
                assert.strictEqual(result.data.status, "success")
            }).catch(err => {
                assert.fail(err.response.data.response)
            })
        })
    })
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// ****************************

// Test For Delete Post 
describe("Test Delete Post Api /userWeblog/posts", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
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
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tags: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
    // Test Delete Post Api 
    describe("Delete Post", () => {
        it("Should Return No Content Response", async () => {
            await axios({
                method: "delete",
                url: baseBlogsUrl + "/userWeblog/posts",
                data: {
                    postId
                },
                headers: {
                    authorization: `Bearer ${userToken}`
                },
            }).then(result => {
                assert.strictEqual(result.status, 204)
            }).catch(err => {
                assert.fail(err.response.data.response)
            })
        })
    })
})

// *****************************************

// Test Edit Post 
describe("Test For Edit Post", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        //Login As Test User And Create A Post For Edit It
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tag: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })

    })
    // Test Deactive User Account
    describe("Edit Post", () => {
        it("Should Return Success Status", async () => {
            await axios({
                method: "put",
                url: baseBlogsUrl + "/userWeblog/posts",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    postId,
                    title: "متن تست6",
                    body: "11111متن تست",
                    category: "دسته بندی تست",
                    tag: "#هشتگتست"
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.data.status, "success")
            }).catch(err => {
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post Who We Created / Edited 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// *********************************

describe("Test For Add Tag", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        //Login As Test User And Create A Post For Add Tag For It
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tag: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })

    })
    // Test Add Tag To Post
    describe("Add Tag To Post", () => {
        it("Should Return Success Status", async () => {
            await axios({
                method: "post",
                url: baseBlogsUrl + "/userWeblog/posts/tags",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    postId,
                    tag: "#تستتگ"
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.data.status, "success")
            }).catch(err => {
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Tag Who We Created 
    after(async () => {
        // Then Delete Post Who We Created / Edited 
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// ******************************* 

describe("Test For Edit Tag", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        //Login As Test User And Create A Post For Edit It
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tag: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
    })
    // Test Edit Tag  Post
    describe("Edit Tag", () => {
        it("Should Return Success Status", async () => {
            await axios({
                method: "put",
                url: baseBlogsUrl + "/userWeblog/posts/tags",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    currentTag: "#تستتگ",
                    updateTag: "#تستتگیک"
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.data.status, "success")
            }).catch(err => {
                console.log(err.response.data);
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post With Rag Who We Edited  
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// ******************************

describe("Test For Delete Tag", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Test User And Create A Post
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tag: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })
    })
    // Test Delete Tag
    describe("Delete Tag", () => {

        it("Should Return Success Status", async () => {
            await axios({
                method: "delete",
                url: baseBlogsUrl + "/userWeblog/posts/tags",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    currentTag: "#تستتگ",
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.status, 204)
            }).catch(err => {
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post Who We Created / Edited 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// *************************************


describe("Test For Add Category", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Test User And Create A Post
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tags: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })
    })
    // Test Add Category
    describe("Add Category", () => {

        it("Should Return Success Status", async () => {
            await axios({
                method: "post",
                url: baseBlogsUrl + "/userWeblog/posts/categorys",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    postId,
                    category: "علمی",
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.data.status, "success")
            }).catch(err => {
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post Who We Created / Edited 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// *****************************

describe("Test Edit Category", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Test User And Create A Post
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tags: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts/categorys",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                postId,
                category: "علمی",
            }
        }).then(result => {
            // Assertation
            console.log(result.data);
        }).catch(err => {
            console.log(err.response.data);
            assert.fail(err.response.data.response);
        })
    })
    // Test Add Category
    describe("Edit Category", () => {

        it("Should Return Success Status", async () => {
            await axios({
                method: "put",
                url: baseBlogsUrl + "/userWeblog/posts/categorys",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    postId,
                    currentCategory: "علمی",
                    updateCategory: "فناوری"
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.data.status, "success")
            }).catch(err => {
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post Who We Created / Edited 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// *******************************************************************

describe("Test Delete Category", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Test User And Create A Post
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tags: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts/categorys",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                postId,
                category: "علمی",
            }
        }).then(result => {
            // Assertation
            console.log(result.data);
        }).catch(err => {
            console.log(err.response.data);
            assert.fail(err.response.data.response);
        })
    })
    // Test Add Category
    describe("Delete Category", () => {

        it("Should Return Success Status", async () => {
            await axios({
                method: "delete",
                url: baseBlogsUrl + "/userWeblog/posts/categorys",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    postId,
                    currentCategory: "علمی",
                }
            }).then(result => {
                // Assertation
                assert.strictEqual(result.status, 204)
            }).catch(err => {
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post Who We Created / Edited 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// ************************************************************

describe("Test Add Comment", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Test User And Create A Post
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tags: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })
    })
    // Test Add Category
    describe("Add Comment", () => {

        it("Should Return Success Status", async () => {
            await axios({
                method: "post",
                url: baseBlogsUrl + "/posts/comments",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    postId,
                    comment: "تست کامنت"
                }
            }).then(result => {
                // Assertation
                console.log(result.data);
                assert.strictEqual(result.data.status, "success")
            }).catch(err => {
                console.log(err.response.data);
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post Who We Created / Edited 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// *********************************************************

describe("Test Edit Comment", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Test User And Create A Post
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tags: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/posts/comments",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                postId,
                comment: "تست کامنت"
            }
        }).then(result => {
            // Assertation
            console.log(result.data);
            assert.strictEqual(result.data.status, "success")
        }).catch(err => {
            console.log(err.response.data);
            assert.fail(err.response.data.response);
        })
    })
    // Test Add Category
    describe("Add Comment", () => {

        it("Should Return Success Status", async () => {
            await axios({
                method: "put",
                url: baseBlogsUrl + "/posts/comments",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    postId,
                    currentComment: "تست کامنت",
                    updateComment: "1تست کامنت"
                }
            }).then(result => {
                // Assertation
                console.log(result.data);
                assert.strictEqual(result.data.status, "success")
            }).catch(err => {
                console.log(err.response.data);
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post Who We Created / Edited 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})

// **************************************************
describe("Test Delete Comment", () => {
    let captchaToken;
    let captchaValue;
    let userToken;
    let postId;
    // First Get Captcha From Captcha Api For Send With Other Information
    before(async () => {
        await axios({
            method: "get",
            url: captchaUrl
        }).then(async captchaResult => {
            captchaToken = captchaResult.data.status.token
            captchaValue = await redisDb.get(captchaToken)
        })
        // Login As Test User And Create A Post
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
        }).catch(err => {
            assert.fail(err.response.data.response);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/userWeblog/posts",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                title: "5متن تست",
                body: "متن تست متن تست",
                tags: "#تستتگ"
            }
        }).then(result => {
            postId = result.data.data.postid
        }).catch(err => {
            console.log(err);
        })
        await axios({
            method: "post",
            url: baseBlogsUrl + "/posts/comments",
            headers: {
                authorization: `Bearer ${userToken}`
            },
            data: {
                postId,
                comment: "تست کامنت"
            }
        }).then(result => {
            // Assertation
            console.log(result.data);
            assert.strictEqual(result.data.status, "success")
        }).catch(err => {
            console.log(err.response.data);
            assert.fail(err.response.data.response);
        })
    })
    // Test Add Category
    describe("Delete Comment", () => {

        it("Should Return Success Status", async () => {
            await axios({
                method: "delete",
                url: baseBlogsUrl + "/posts/comments",
                headers: {
                    authorization: `Bearer ${userToken}`
                },
                data: {
                    currentComment: "تست کامنت"
                }
            }).then(result => {
                // Assertation
                console.log(result.status);
                assert.strictEqual(result.status, 204)
            }).catch(err => {
                console.log(err.response.data);
                assert.fail(err.response.data.response);
            })
        })
    })
    // Then Delete Post Who We Created / Edited 
    after(async () => {
        await axios({
            method: "delete",
            url: baseBlogsUrl + "/userWeblog/posts",
            data: {
                postId
            },
            headers: {
                authorization: `Bearer ${userToken}`
            },
        }).catch(err => {
            assert.fail(err.response.data.response)
        })
    })
})