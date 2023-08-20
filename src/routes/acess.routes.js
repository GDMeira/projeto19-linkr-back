import { Router } from "express";
import { login, logout, register } from "../controllers/acess.controller.js";
import { validadeSchema } from "../middlewares/validateSchema.js";
import schemaRegister from "../schemas/register.schema.js";
import schemaLogin from "../schemas/login.schema.js";




const acessRouter = Router()

acessRouter.post('/signup', validadeSchema(schemaRegister),register)
acessRouter.post('/signin',validadeSchema(schemaLogin),login)
acessRouter.delete('/logout',logout)



export default acessRouter