import { Router } from "express";
import acessRouter from "./acess.routes.js";
import hashtagRouter from "./hashtag.routes.js";
import postRouter from "./post.router.js";
import searchRouter from "./search.router.js";
import commentsRouter from "./comments.routes.js";
import followRouter from "./follow.routes.js";


const router = Router()

router.use(acessRouter)
router.use(hashtagRouter)
router.use(postRouter)
router.use(searchRouter)
router.use(commentsRouter)
router.use(followRouter)

export default router