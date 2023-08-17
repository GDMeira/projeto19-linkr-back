import { Router } from "express";
import acessRouter from "./acess.routes.js";
import hashtagRouter from "./hashtag.routes.js";


const router = Router()

router.use(acessRouter)
router.use(hashtagRouter)


export default router