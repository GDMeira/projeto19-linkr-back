import { Router } from "express";
import acessRouter from "./acess.routes.js";


const router = Router()

router.use(acessRouter)


export default router