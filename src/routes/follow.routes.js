import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import { follow, unfollow} from "../controllers/follow.controller.js";




const followRouter = Router()

followRouter.post('/follow/:followedId', tokenValidation, follow)
followRouter.delete('/unfollow/:followedId', tokenValidation, unfollow)



export default followRouter