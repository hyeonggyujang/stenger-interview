import express from 'express';
import pool from './db.js';
import dotenv from 'dotenv';
import router from './routes.js';
import cors from 'cors';
dotenv.config(); 

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', router);

async function connectWithRetry() {
    const maxRetries = 5;
    const delay = 2000;
    for (let i = 0; i < maxRetries; i++) {
        try {
            await pool.connect();
            console.log('Connected to the database!');
            return;
        } catch (err) {
            console.error(`Attempt ${i + 1} failed: ${err.message}`);
            if (i < maxRetries - 1) {
                console.info(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error('Max retries reached. Unable to connect to the database.');
}

async function startServer() {
    try {
        await connectWithRetry();

        const PORT = process.env.PORT || 3002;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
}

startServer();

export default app;