import { Router } from "express";
import { login, register } from "../controllers/acess.controller.js";
import { validadeSchema } from "../middlewares/validateSchema.js";
import schemaRegister from "../schemas/register.schema.js";




const acessRouter = Router()

<<<<<<< HEAD
acessRouter.post('/cadastro', validadeSchema(schemaRegister),register)
acessRouter.post('/',login)
=======
acessRouter.post('/signup', validadeSchema(schemaRegister),register)
acessRouter.post('/signin',login)
>>>>>>> feature/register



export default acessRouter