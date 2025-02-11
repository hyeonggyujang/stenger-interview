import fs from 'fs';
import path from 'path';
import pool from '../db.js';

async function initDb() {
    try {
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        const sql = fs.readFileSync(
            path.join(__dirname, 'migrations', '001_create_users.sql'),
            'utf8'
        );
        await pool.query(sql);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        pool.end();
    }
}

initDb(); 