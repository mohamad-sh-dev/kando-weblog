const filterObj = (obj , ...allowedfields)=>{
    const newObj = {}
    // set allowed fields to an object 
    Object.keys(obj).forEach(el=>{
        if(allowedfields.includes(el)){
            newObj [el] = obj [el]
        }
    })
    return newObj
}

module.exports = {filterObj}