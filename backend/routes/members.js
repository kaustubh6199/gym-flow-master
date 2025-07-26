const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Get all members
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, mp.name as plan_name, mm.end_date as membership_end_date
      FROM members m
      LEFT JOIN member_memberships mm ON m.id = mm.member_id AND mm.status = 'active'
      LEFT JOIN membership_plans mp ON mm.plan_id = mp.id
      ORDER BY m.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Create new member
router.post('/', async (req, res) => {
  try {
    const {
      first_name, last_name, email, phone, date_of_birth,
      address, emergency_contact_name, emergency_contact_phone
    } = req.body;

    // Generate member ID
    const memberIdResult = await pool.query('SELECT COUNT(*) FROM members');
    const memberCount = parseInt(memberIdResult.rows[0].count);
    const member_id = `GYM${String(memberCount + 1).padStart(4, '0')}`;

    const result = await pool.query(`
      INSERT INTO members (
        member_id, first_name, last_name, email, phone, date_of_birth,
        address, emergency_contact_name, emergency_contact_phone, join_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE)
      RETURNING *
    `, [member_id, first_name, last_name, email, phone, date_of_birth,
        address, emergency_contact_name, emergency_contact_phone]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// Update member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name, last_name, email, phone, date_of_birth,
      address, emergency_contact_name, emergency_contact_phone, status
    } = req.body;

    const result = await pool.query(`
      UPDATE members SET
        first_name = $1, last_name = $2, email = $3, phone = $4,
        date_of_birth = $5, address = $6, emergency_contact_name = $7,
        emergency_contact_phone = $8, status = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [first_name, last_name, email, phone, date_of_birth,
        address, emergency_contact_name, emergency_contact_phone, status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM members WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

module.exports = router;