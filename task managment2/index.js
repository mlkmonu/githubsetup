import express from "express";
import "dotenv/config";
impot userRouter from "./src/routes/userRoutes.js";
import taskRouter from "./src/routes/taskroutes.js";
import adminRouter from "./src/routes/adminroutes.js";


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/admin",adminRouter);


app.listen(port, () => console.log(`Server running on port ${port}`));