import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import getHashtagByName from "../controllers/hashtag.controller.js";




const hashtagRouter = Router()

hashtagRouter.get('/hashtag/:hashtag', tokenValidation, getHashtagByName)



export default hashtagRouter