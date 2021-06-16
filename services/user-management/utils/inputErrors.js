exports.buildHumanErrors = (errors) => {
    errors.map(e=>{
        const key = e.keyword
        console.log(e.keyword);
        if(key === "format"){
          console.log(e.message);
          return e.message = ` خود را کنترل نمایید ${e.instancePath.split("/")[1]} لطفا ورودی`
        } else if(key === "minLength"){
            return e.message = `(${e.params.limit} کاراکتر) باید دارای حداقل کاراکتر باشد ${e.instancePath.split("/")[1]} ورودی `
        }else if(key === 'required'){
            return e.message = `ضروری میباشد ${e.params.missingProperty} وارد کردن `
        }else if(e.keyword === 'const'){
            return e.message = `همسان نمیباشند ${e.params.allowedValue} و ${e.instancePath.split("/")[1]}`
        }
    })
    
}