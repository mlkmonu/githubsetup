import {gettask} from "../controller/admincontroller.js"
import { userVerify } from "../util/verifytoken.js";
import { adminVerify } from "../middleware/adminVerify.js";
import { Router } from "express"
const adminRouter=Router();
adminRouter.get("/gettask", userVerify, adminVerify,gettask)

export default adminRouter;