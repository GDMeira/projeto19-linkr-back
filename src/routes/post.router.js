import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.js"
import { validateToken } from "../middlewares/validateToken.js"
import { getLinks, postLink } from "../controllers/post.controller.js"
import { postSchema } from "../schemas/post.schemas.js"


const postsRouter = Router()

postsRouter.get("/home", validateToken, getLinks);
postsRouter.post("/home", validateToken, validateSchema(postSchema), postLink)
postsRouter.get("/posts/:id", validateToken, getPostById);
postsRouter.delete("/home/:id", validateToken, deletePost);


export default postsRouter