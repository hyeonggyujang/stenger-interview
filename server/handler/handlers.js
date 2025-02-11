import pool from '../db.js';

export const getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, phone_number } = req.body;
        const { rows } = await pool.query('INSERT INTO users (first_name, last_name, phone_number) VALUES ($1, $2, $3) RETURNING *', [first_name, last_name, phone_number]);
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone_number } = req.body;
        const { rows } = await pool.query('UPDATE users SET first_name = $1, last_name = $2, phone_number = $3 WHERE id = $4 RETURNING *', [first_name, last_name, phone_number, id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};