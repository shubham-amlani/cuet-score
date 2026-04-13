import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// These handlers now have full access to your .env variables
import calculateHandler from './api/calculate.js';
import leaderboardHandler from './api/leaderboard.js';
import adminHandler from './api/admin-data.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Verification Log: This will show in your terminal to confirm keys are loaded
console.log("🛠️  Supabase URL Loaded:", process.env.SUPABASE_URL ? "✅" : "❌");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Routes
app.post('/api/calculate', calculateHandler);
app.get('/api/leaderboard', leaderboardHandler);
app.get('/api/admin-data', adminHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Blaster Server running at http://localhost:${PORT}`);
});