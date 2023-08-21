import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import { searchUser } from "../controllers/search.controller.js";




const searchRouter = Router()

searchRouter.get('/search', tokenValidation, searchUser)


export default searchRouter