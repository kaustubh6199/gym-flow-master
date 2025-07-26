const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Get attendance records
router.get('/', async (req, res) => {
  try {
    const { date, member_id, limit = 50 } = req.query;
    
    let query = `
      SELECT a.*, m.first_name, m.last_name, m.member_id
      FROM attendance a
      JOIN members m ON a.member_id = m.id
    `;
    const params = [];
    const conditions = [];

    if (date) {
      conditions.push(`DATE(a.check_in_time) = $${params.length + 1}`);
      params.push(date);
    }

    if (member_id) {
      conditions.push(`a.member_id = $${params.length + 1}`);
      params.push(member_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY a.check_in_time DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Check in member
router.post('/checkin', async (req, res) => {
  try {
    const { member_id } = req.body;

    // Verify member exists and is active
    const memberResult = await pool.query(
      'SELECT id, status FROM members WHERE id = $1',
      [member_id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (memberResult.rows[0].status !== 'active') {
      return res.status(400).json({ error: 'Member is not active' });
    }

    // Check if already checked in today
    const existingCheckin = await pool.query(`
      SELECT id FROM attendance 
      WHERE member_id = $1 AND DATE(check_in_time) = CURRENT_DATE AND check_out_time IS NULL
    `, [member_id]);

    if (existingCheckin.rows.length > 0) {
      return res.status(400).json({ error: 'Member already checked in today' });
    }

    // Create attendance record
    const result = await pool.query(`
      INSERT INTO attendance (member_id, check_in_time)
      VALUES ($1, CURRENT_TIMESTAMP)
      RETURNING *
    `, [member_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error checking in member:', error);
    res.status(500).json({ error: 'Failed to check in member' });
  }
});

// Check out member
router.post('/checkout', async (req, res) => {
  try {
    const { member_id } = req.body;

    // Find active attendance record
    const result = await pool.query(`
      UPDATE attendance 
      SET check_out_time = CURRENT_TIMESTAMP
      WHERE member_id = $1 AND DATE(check_in_time) = CURRENT_DATE AND check_out_time IS NULL
      RETURNING *
    `, [member_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active check-in found for today' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error checking out member:', error);
    res.status(500).json({ error: 'Failed to check out member' });
  }
});

// Get member's attendance history
router.get('/member/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, limit = 30 } = req.query;

    let query = `
      SELECT * FROM attendance 
      WHERE member_id = $1
    `;
    const params = [id];

    if (startDate) {
      query += ` AND DATE(check_in_time) >= $${params.length + 1}`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND DATE(check_in_time) <= $${params.length + 1}`;
      params.push(endDate);
    }

    query += ` ORDER BY check_in_time DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching member attendance:', error);
    res.status(500).json({ error: 'Failed to fetch member attendance' });
  }
});

module.exports = router;