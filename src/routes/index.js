import { Router } from "express";
import acessRouter from "./acess.routes.js";
import hashtagRouter from "./hashtag.routes.js";
import postRouter from "./post.router.js";


const router = Router()

router.use(acessRouter)
router.use(hashtagRouter)
router.use(postRouter)

export default router