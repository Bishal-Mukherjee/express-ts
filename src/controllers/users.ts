import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const results = await pool.query("SELECT * FROM users");
    res.status(200).json({ results: results.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const results = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    res.status(200).json({ results: results.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
