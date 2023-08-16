import joi from "joi"


const schemaLogin = joi.object({
    email : joi.string().email().required(),
    password: joi.string().required(),
   
})

export default schemaLogin