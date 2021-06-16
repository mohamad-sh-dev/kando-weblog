exports.successMsgs = {
    _successMsg : "success" ,
    _successAuthorizeMsg : "Grant" ,
    _successStatusCode : 200,
    _successCreateStatusCode : 201 ,
    _allAccesses : "تمام دسترسی ها" ,
    _roleAdded : "role successfuly added" ,
    _SuccessFullyCreate : "اطلاعات با موفقیت ثبت شد",
    _SuccessfullyAccessCreate : "دسترسی با موفقیت افزوده شد",
}

exports.badRequestesMsgs = {
    _badRequestStatusCode : 400 , 
    _failMsg : "fail" ,
    _hasNoEnterRoleOrResuorce : "وارد کردن نقش و منبع ضروری میباشد",
    _hasThisRole :"منبع دارای نقش وارد شده می باشد",
    _invalidInformations  : "لطفا اطلاعات افزودن سطح دسترسی را به درستی وارد نمایید",
    _hasWrongRole :"نقش باید شامل ادمین یا بلاگر باشد" ,
    _hasNoEnterInformation :  "لطفا اطلاعات سطح دسترسی را وارد نمایید",
    _hasNoEnterRoleAndName :"وارد کردن ایدی کاربر و نام نقش ضروری میباشد" ,
    _hasNoEnterOwnerPass :"لطفا رمز عبور مالک را وارد نمایید"
}

exports.notFoundMsgs = {
    _notFoundStatusCode : 404 ,
    _notFoundMsg :  "not found" ,
    _notDataFound : "داده یافت نشد" ,
    _noAccessFound : "دسترسی وارد شده وجود ندارد"
}
exports.unauthorizeMsgs = {
    _unauthorizeStatusCode : 401 ,
    _NotEntered : "شما وارد نشدید،لطفا برای دسترسی ابتدا وارد حساب کاربری خود شوید(سیستم کنترل دسترسی)",
    _expireTokenOrNoExist : "توکن شما منقضی شده است یا این کاربر دیگر در دسترس نمیباشد",
    _hasNoAuthorize :"هویت شما تایید نشد"
}
exports.forbiddenMsgs = {
    _forbiddenStatusCode : 403 ,
    _forbiddMsg : "Denied" ,
    _forbiddenMsg :"دسترسی برای شما مقدور نمیباشد" ,
}
exports.deleteStatusCode ={
    _deleteStatusCode : 204
}
exports.internalServerErr = {
    _internalServerErr :"مشکلی در دریافت اطلاعات وجود دارد لطفا مجددا تلاش نمایید"
}
