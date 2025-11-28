import { Router } from "express";
import {registerUser,loginUser,logoutUser} from "../controller/userController.js";
import {create} from "../controller/taskcontroller.js";
import { userVerify } from "../util/verifytoken.js";


const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/task", userVerify,create, )
export default userRouter;

