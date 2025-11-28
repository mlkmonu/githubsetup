import { Router } from "express";
import { deleteTask, getAllTask, updateTask ,getUserTask} from "../controller/taskcontroller.js";
import { userVerify } from "../util/verifytoken.js";

const taskRouter = Router();

taskRouter.get("/gettask", userVerify, getAllTask);
// taskRouter.get("/task/:id", userVerify, getUserTask);
taskRouter.put("/update/:id", userVerify, updateTask);
taskRouter.delete("/delete/:id", userVerify, deleteTask);
export default taskRouter;
