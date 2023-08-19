import { Router } from "express"
import { validadeSchema } from "../middlewares/validateSchema.js"
import { tokenValidation } from "../middlewares/tokenValidation.js"
import { getposts, getPostById, deletePost, postLink, getPostByUser } from "../controllers/post.controller.js"
import { postSchema } from "../schemas/post.schemas.js"


const postsRouter = Router()

postsRouter.get("/home", tokenValidation, getposts);
postsRouter.post("/home", tokenValidation, validadeSchema(postSchema), postLink)
postsRouter.get("/posts/:id", tokenValidation, getPostById);
postsRouter.delete("/home/:id", tokenValidation, deletePost);
postsRouter.get("/user/:id", tokenValidation, getPostByUser);


export default postsRouter