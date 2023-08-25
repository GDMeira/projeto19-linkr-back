import { Router } from "express";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import { follow, unfollow, getFollowedsUsers} from "../controllers/follow.controller.js";




const followRouter = Router()

followRouter.post('/follow/:followedId', tokenValidation, follow)
followRouter.delete('/unfollow/:followedId', tokenValidation, unfollow)
followRouter.get('/followeds', tokenValidation, getFollowedsUsers)




export default followRouter