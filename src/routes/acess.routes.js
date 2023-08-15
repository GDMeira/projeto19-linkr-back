import { Router } from "express";
import { login, register } from "../controllers/acess.controller.js";
import { validadeSchema } from "../middlewares/validateSchema.js";
import schemaRegister from "../schemas/register.schema.js";




const acessRouter = Router()

acessRouter.post('/cadastro', validadeSchema(schemaRegister),register)
acessRouter.post('/',login)



export default acessRouter