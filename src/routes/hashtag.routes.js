import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import getTrending, { getHashtagByName } from "../controllers/hashtag.controller.js";




const hashtagRouter = Router()

hashtagRouter.get('/hashtags/:hashtag', tokenValidation, getHashtagByName)
hashtagRouter.get('/trending', tokenValidation, getTrending)



export default hashtagRouter