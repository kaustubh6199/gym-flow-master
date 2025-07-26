const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Get all billing records
router.get('/', async (req, res) => {
  try {
    const { status, member_id, limit = 50 } = req.query;
    
    let query = `
      SELECT b.*, m.first_name, m.last_name, m.member_id
      FROM billing b
      JOIN members m ON b.member_id = m.id
    `;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`b.payment_status = $${params.length + 1}`);
      params.push(status);
    }

    if (member_id) {
      conditions.push(`b.member_id = $${params.length + 1}`);
      params.push(member_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching billing records:', error);
    res.status(500).json({ error: 'Failed to fetch billing records' });
  }
});

// Get billing record by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT b.*, m.first_name, m.last_name, m.member_id
      FROM billing b
      JOIN members m ON b.member_id = m.id
      WHERE b.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Billing record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching billing record:', error);
    res.status(500).json({ error: 'Failed to fetch billing record' });
  }
});

// Create new billing record
router.post('/', async (req, res) => {
  try {
    const { member_id, amount, description, payment_method, due_date } = req.body;

    const result = await pool.query(`
      INSERT INTO billing (member_id, amount, description, payment_method, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [member_id, amount, description, payment_method, due_date]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating billing record:', error);
    res.status(500).json({ error: 'Failed to create billing record' });
  }
});

// Update payment status
router.put('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method } = req.body;

    const paid_date = payment_status === 'paid' ? 'CURRENT_DATE' : null;

    const result = await pool.query(`
      UPDATE billing SET
        payment_status = $1, 
        payment_method = $2,
        paid_date = ${paid_date ? 'CURRENT_DATE' : 'NULL'}
      WHERE id = $3
      RETURNING *
    `, [payment_status, payment_method, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Get member's billing history
router.get('/member/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20 } = req.query;

    const result = await pool.query(`
      SELECT * FROM billing 
      WHERE member_id = $1
      ORDER BY created_at DESC 
      LIMIT $2
    `, [id, limit]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching member billing:', error);
    res.status(500).json({ error: 'Failed to fetch member billing history' });
  }
});

// Get revenue summary
router.get('/summary/revenue', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let query = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(amount) as total_revenue,
        SUM(CASE WHEN payment_status = 'paid' THEN amount ELSE 0 END) as paid_revenue,
        SUM(CASE WHEN payment_status = 'pending' THEN amount ELSE 0 END) as pending_revenue
      FROM billing
    `;
    const params = [];

    if (start_date && end_date) {
      query += ` WHERE created_at >= $1 AND created_at <= $2`;
      params.push(start_date, end_date);
    }

    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching revenue summary:', error);
    res.status(500).json({ error: 'Failed to fetch revenue summary' });
  }
});

module.exports = router;