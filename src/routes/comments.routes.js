import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import { stringStripHtml } from "../middlewares/stringStripHtmlValidation.js";
import { validadeSchema } from "../middlewares/validateSchema.js";
import { commentSchema } from "../schemas/comment.schema.js";
import { createComment } from "../controllers/comment.controller.js";

const commentsRouter = Router()

commentsRouter.post('/comments/:postId', tokenValidation, stringStripHtml, 
    validadeSchema(commentSchema), createComment);


export default commentsRouter