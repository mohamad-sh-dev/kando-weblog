exports.successMsgs = {
    _successMsg : "success" ,
    _successStatusCode : 200,
    _successCreateStatusCode : 201 ,
    _createSuccessfullyMsg : "اطلاعات شما با موفقیت ثبت شد" ,
    _successEnter : "ورود شما با موفقیت انجام شد",
    _successEditPass : "رمز عبور جدید شما با موفقیت ثبت شد",
    _successDeactive :"حساب کاربری شما غیر فعال شد برای فعال سازی حساب کاربری خود وارد سامانه شوید"
}

exports.badRequestesMsgs = {
    _badRequestStatusCode : 400 , 
    _failMsg : "fail" ,
    _cantBeEmpty :"ایمیل یا رمز عبور نمیتواند خالی باشد" ,
    _hasNoEnterEmailAndPass : "لطفا ایمیل و رمز عبور ادمین را وارد نمایید",
    _cantEditFromHere_pass : "از این قسمت نمیتوانید رمز عبور خود را تغییر دهید" ,
    _wrongPass : "رمزعبور وارد شده اشتباه است" ,
    _email : "ایمیل از قبل وجود دارد" ,
    _invalidCaptcha : "کد کپچا مورد نظر منقضی شده یا دیگر در دسترس نمیباشد لطفا کد جدید دریافت نمایید",
    _hasNoEnterCaptcha : "لطفا اطلاعات کپچا را وارد نمایید" ,
    password : {
        _enterCurrentPassword : "لطفا رمز عبور فعلی و رمز عبور جدید خود را وارد نمایید"
    }
}

exports.notFoundMsgs = {
    _notFoundStatusCode : 404 ,
    _notFoundMsg :  "not found" ,
    _notFoundEmail : "ایمیل وجود ندارد",
    noUserFoundWithIdMsg :"کاربری با شناسه وارد شده وجود ندارد" ,
    noUserFoundWithEmailMsg :"کاربری با ایمیل وارد شده وجود ندارد",
    _noUserFound : "هیچ کاربری پیدا نشد"
}
exports.unauthorizeMsgs = {
    _unauthorizeStatusCode : 401 ,
    _wrongEmailOrPass : "ایمیل یا رمز عبور اشتباه است",
    _NotEntered : "شما وارد نشدید،لطفا برای دسترسی ابتدا وارد حساب کاربری خود شوید",
    _expireTokenOrNoExist : "توکن شما منقضی شده است یا این کاربر دیگر در دسترس نمیباشد",
}
exports.forbiddenMsgs = {
    _forbiddenStatusCode : 403 ,
    _forbiddenMsg :"دسترسی برای شما مقدور نمیباشد" ,
}
exports.deleteStatusCode ={
    _deleteStatusCode : 204
}
exports.internalServerErr = {
    _internalServerErr :"مشکلی در دریافت اطلاعات وجود دارد لطفا مجددا تلاش نمایید"
}
exports.ca = {
    _internalServerErr :"مشکلی در دریافت اطلاعات وجود دارد لطفا مجددا تلاش نمایید"
}