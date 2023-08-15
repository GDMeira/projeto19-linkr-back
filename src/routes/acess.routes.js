import { Router } from "express";
import { login, register } from "../controllers/acess.controller.js";
import schemaRegister from "../schema/register.schema.js";
import { validadeSchema } from "../middlewares/validateSchema.js";
//import schemaLogin from "../schema/login.schema.js";




const acessRouter = Router()

acessRouter.post('/cadastro',validadeSchema(schemaRegister),register)
acessRouter.post('/signin',login)



export default acessRouter