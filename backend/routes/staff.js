const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Get all staff
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, u.email, u.first_name, u.last_name, u.role
      FROM staff s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true
      ORDER BY s.hire_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// Get staff by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT s.*, u.email, u.first_name, u.last_name, u.role
      FROM staff s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
});

// Create new staff member
router.post('/', async (req, res) => {
  try {
    const { user_id, position, hire_date, salary, department } = req.body;

    // Generate employee ID
    const empIdResult = await pool.query('SELECT COUNT(*) FROM staff');
    const empCount = parseInt(empIdResult.rows[0].count);
    const employee_id = `EMP${String(empCount + 1).padStart(4, '0')}`;

    const result = await pool.query(`
      INSERT INTO staff (user_id, employee_id, position, hire_date, salary, department)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [user_id, employee_id, position, hire_date, salary, department]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

// Update staff member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { position, salary, department, is_active } = req.body;

    const result = await pool.query(`
      UPDATE staff SET
        position = $1, salary = $2, department = $3, is_active = $4
      WHERE id = $5
      RETURNING *
    `, [position, salary, department, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

// Delete staff member (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE staff SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    res.json({ message: 'Staff member deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating staff member:', error);
    res.status(500).json({ error: 'Failed to deactivate staff member' });
  }
});

module.exports = router;