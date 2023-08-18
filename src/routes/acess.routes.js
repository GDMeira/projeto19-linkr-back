import { Router } from "express";
import { login, register } from "../controllers/acess.controller.js";
import { validadeSchema } from "../middlewares/validateSchema.js";
import schemaRegister from "../schemas/register.schema.js";




const acessRouter = Router()

acessRouter.post('/signup', validadeSchema(schemaRegister), register)
acessRouter.post('/signin',login)



export default acessRouter