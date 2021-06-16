exports.successMsgs = {
    _successStatusCode : 200,
    _successCreateStatusCode : 201 ,
    _successMsg : "success",
    _addPostMsg : "پست با موفقیت در وبلاگ شما افزوده شد",
    _addTagSuccessMsg : 'برچسب با موفقیت افزوده شد' ,
    _editTagSuccessMsg : 'برچسب با موفقیت ویرایش شد' ,
    _addCatSuccessMsg :  'دسته بندی با موفقیت افزوده شد' , 
    _editCatSuccessMsg :'برچسب با موفقیت ویرایش شد' ,
    _editPostSuccessMsg :"پست شما با موفقیت ویرایش شد" ,
    _activeComment : 'ثبت نظر برای پست فعال شد' ,
    _deActiveComment : 'ثبت نظر برای پست غیرفعال شد' ,
    _addComment : 'نظر با موفقیت ثبت شد' ,
    _editComment : 'نظر با موفقیت ویرایش شد' ,
    _findBlogs : 'تمامی وبلاگ ها',
    _findPosts : 'تمامی پست ها',
    _findBlog :  'وبلاگ شما' ,
    _findAllCategorysAndTagsInBlog :'نتیجه درخواست موفقیت آمیز'
}

exports.badRequestesMsgs = {
    _badRequestStatusCode : 400 , 
    _failMsg : "fail" ,
    _hasNotEnterBlogId : "لطفا شناسه وبلاگ مورد نظر را وارد نمایید",
    _hasNotEnterPostId : "لطفا شناسه پست مورد نظر را وارد نمایید",
    _hasNotEnterCategory : "لطفا دسته بندی موردنظر را وارد نمایید",
    _hasNotEnterComment : "لطفا نظر را وارد نمایید",
    _hasNotEnterTag : "لطفا برچسب موردنظر را وارد نمایید",
    _cantEditOrDeleteCategory :"شما نمیتوانید این دسته بندی را ویرایش یا حذف نمایید",
    _cantEditOrDeleteTag :"شما نمیتوانید این برچسب را ویرایش یا حذف نمایید",
    _cantEditOrDeleteComment :"شما نمیتوانید این نظر ویرایش یا حذف نمایید" ,
    _defualtCategory :"دسته بندی پیش فرض نمیتواند ویرایش یا حذف شود" ,
    _cantEditFromHere_category : "از این قسمت نمیتوانید عنوان،متن یا برچسب را ویرایش نمایید" ,
    _cantEditFromHere_Tag : "از این قسمت نمیتوانید عنوان،متن یا دسته بندی را ویرایش نمایید" ,
    _cantEditFromHere_comment : "از این قسمت نمیتوانید عنوان،متن،دسته بندی یا برچسب را ویرایش نمایید" ,
    _justBlogersAccess : "فقط عضوهای بلاگر می تواند به این بخش دسترسی داشته باشند",
    _duplicateTitle : "این عنوان متعلق به پست دیگری میباشد لطفا عنوانی دیگر انتخاب نمایید",
    _notAllowedComment : "امکان ثبت نظر برای پست با شناسه وارد شده وجود ندارد",
    _postBelongToOtherBlog : "این پست متعلق به وبلاگ شما نمیباشد!"
}

exports.notFoundMsgs = {
    _notFoundStatusCode : 404 ,
    _notFoundMsg :  "not found" ,
    _noPosts :  "پستی در سامانه موجود نمیباشد" ,
    _noUserPost :"شما هیچ پستی در سامانه هنوز ثبت نکرده اید" ,
    _noPostWithCat :  "پستی با دسته بندی وارد شده وجود ندارد",
    _noPostWithId :  "پست با شناسه وارد شده وجود ندارد",
    _noCategory : "دسته بندی مورد نظر پیدا نشد" ,
    _noComment : "کامنت مورد نظر پیدا نشد",
    _noTag : "برچسب مورد نظر پیدا نشد" ,
}
exports.unauthorizeMsgs = {
    _unauthorizeStatusCode : 401 ,
    _expireTokenOrNoExist : "توکن شما منقضی شده است یا این کاربر دیگر در دسترس نمیباشد",
    _NotEntered : "شما وارد نشدید،لطفا برای دسترسی ابتدا وارد حساب کاربری خود شوید",
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