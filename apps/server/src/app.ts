import express from "express";
import { pool } from "./db";

const app = express();

app.use(express.json());

app.get("/api/health", async(_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connection successful' })
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', db: 'connection failed'})
  }
});

export default app;
