import { Router } from "express"
import { validadeSchema } from "../middlewares/validateSchema.js"
import { tokenValidation } from "../middlewares/tokenValidation.js"
import { getposts, getPostById, deletePost, editPost, postLink, getPostByUser, postLike, deleteLike } from "../controllers/post.controller.js"
import { postSchema } from "../schemas/post.schemas.js"


const postsRouter = Router()

postsRouter.get("/home", tokenValidation, getposts);
postsRouter.post("/home", tokenValidation, validadeSchema(postSchema), postLink)
postsRouter.get("/posts/:id", tokenValidation, getPostById);
//postsRouter.delete("/home/:id", tokenValidation, deletePost);
postsRouter.get("/user/:id", tokenValidation, getPostByUser);
postsRouter.post("/posts/:postId/like", tokenValidation, postLike);
postsRouter.delete("/posts/:postId/dislike", tokenValidation, deleteLike);
postsRouter.put("/posts/:postId", tokenValidation, editPost);
postsRouter.delete("/posts/:postId", tokenValidation, deletePost);



export default postsRouter