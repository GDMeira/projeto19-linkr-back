import joi from "joi"


const schemaRegister = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    userName : joi.string().required(),
    pictureUrl: joi.string().uri()
    
})

export default schemaRegister