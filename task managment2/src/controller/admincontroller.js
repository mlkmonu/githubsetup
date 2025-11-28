import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import prisma from "../lib/prismaclient.js";


//getAlltasks
export const  gettask = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Could not fetch tasks",
      error: error.message,
    });
  }
};

