import { Router } from "express";
import { deleteSession, login, register } from "../controllers/acess.controller.js";
import { validadeSchema } from "../middlewares/validateSchema.js";
import schemaRegister from "../schemas/register.schema.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";




const acessRouter = Router()

acessRouter.post('/signup', validadeSchema(schemaRegister), register)
acessRouter.post('/signin',login)
acessRouter.delete('/logout', tokenValidation, deleteSession)

export default acessRouter