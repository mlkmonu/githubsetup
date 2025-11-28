import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import prisma from "../lib/prismaclient.js";
//create task
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title cannot exceed 255 characters" }),
  description: z
    .string()
    .max(1000, { message: "Description cannot exceed 1000 characters" }),
});
export const create = async (req, res) => {
  try {
    const task = taskSchema.safeParse(req.body);

    if (!task.success)
      return res.status(400).json({
        message: "input is not valid",
        recievedBody: req.body,
      });
    const userId = req.user.id;
    const { title, description } = task.data;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return res.status(200).json({
      message: "Task created successfully",
      recievedBody: newTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "task are not created",
      error: error.message,
    });
  }
};

// Get all tasks
export const getAllTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const userTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: userTasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Could not fetch tasks",
      error: error.message,
    });
  }
};

// Task update
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
});

export const updateTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const validate = updateTaskSchema.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: validate.error.issues,
      });
    }

    const userId = req.user.id;
    const updateData = validate.data;

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found or unauthorized",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
};

//delete Task
export const deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found or unauthorized",
      });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return res.status(200).json({
      message: "Task deleted successfully",
      deletedTaskId: taskId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// get specific user task
export const getUserTask = async (req, res) => {
  try {
    const paramUserId = String(req.params.id); // string because Register.id is String (UUID)

    // Check if user exists
    const userExist = await prisma.register.findUnique({
      where: { id: paramUserId },
    });

    if (!userExist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Fetch tasks of that user
    const tasks = await prisma.task.findMany({
      where: {
        userId: paramUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
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
