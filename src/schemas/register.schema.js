import joi from "joi"


const schemaRegister = joi.object({
    
    email: joi.string().email().required(),
    password: joi.string().required(),
    username : joi.string().required(),
    url: joi.string().trim().required()
    
})

export default schemaRegister