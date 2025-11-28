import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"
import prisma from "../lib/prismaclient.js";


export const registerUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is too short")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(2, "Last name is too short")
    .max(50, "Last name is too long"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password is too short"),
});

export const registerUser = async (req, res) => {
  try {
    const validateData = registerUserSchema.safeParse(req.body);

    if (!validateData.success) {
      return res.status(400).json({
        error: validateData.error.errors,
      });
    }

    const { firstName, lastName, email, password } = validateData.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.register.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    // return res.status(201).json({ user: newUser });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//login user
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUser = async (req, res) => {
  try {
    const validateData = loginSchema.safeParse(req.body);

    if (!validateData.success) {
      return res.status(400).json({
        error: validateData.error.errors,
      });
    }

    const { email, password } = validateData.data;

    const user = await prisma.register.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    return res.status(200).json({
      data: user,
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


//logout user
export const logoutUser = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,    
      sameSite: "lax"
    });

    return res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Logout failed",
      error: error.message
    });
  }
};


