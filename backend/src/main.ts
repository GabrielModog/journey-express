import { config } from 'dotenv';
import express from "express"

config()

const app = express()

const PORT = process.env.BACKEND_PORt || 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});