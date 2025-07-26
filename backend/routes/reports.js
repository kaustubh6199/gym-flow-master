const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Dashboard summary report
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get key metrics
    const [
      totalMembers,
      activeMembers,
      todayCheckins,
      monthlyRevenue,
      expiringSoon
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM members'),
      pool.query("SELECT COUNT(*) as count FROM members WHERE status = 'active'"),
      pool.query('SELECT COUNT(*) as count FROM attendance WHERE DATE(check_in_time) = CURRENT_DATE'),
      pool.query(`
        SELECT COALESCE(SUM(amount), 0) as revenue 
        FROM billing 
        WHERE payment_status = 'paid' AND paid_date >= $1
      `, [lastMonth]),
      pool.query(`
        SELECT COUNT(*) as count 
        FROM member_memberships mm
        JOIN members m ON mm.member_id = m.id
        WHERE mm.end_date <= CURRENT_DATE + INTERVAL '7 days' 
        AND mm.status = 'active'
        AND m.status = 'active'
      `)
    ]);

    res.json({
      totalMembers: parseInt(totalMembers.rows[0].count),
      activeMembers: parseInt(activeMembers.rows[0].count),
      todayCheckins: parseInt(todayCheckins.rows[0].count),
      monthlyRevenue: parseFloat(monthlyRevenue.rows[0].revenue),
      expiringSoon: parseInt(expiringSoon.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching dashboard report:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard report' });
  }
});

// Attendance report
router.get('/attendance', async (req, res) => {
  try {
    const { start_date, end_date, member_id } = req.query;

    let query = `
      SELECT 
        DATE(a.check_in_time) as date,
        COUNT(*) as checkins,
        COUNT(DISTINCT a.member_id) as unique_members
      FROM attendance a
      JOIN members m ON a.member_id = m.id
    `;
    const params = [];
    const conditions = [];

    if (start_date) {
      conditions.push(`DATE(a.check_in_time) >= $${params.length + 1}`);
      params.push(start_date);
    }

    if (end_date) {
      conditions.push(`DATE(a.check_in_time) <= $${params.length + 1}`);
      params.push(end_date);
    }

    if (member_id) {
      conditions.push(`a.member_id = $${params.length + 1}`);
      params.push(member_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY DATE(a.check_in_time) ORDER BY date DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ error: 'Failed to fetch attendance report' });
  }
});

// Revenue report
router.get('/revenue', async (req, res) => {
  try {
    const { start_date, end_date, group_by = 'month' } = req.query;

    let dateGroup;
    switch (group_by) {
      case 'day':
        dateGroup = 'DATE(paid_date)';
        break;
      case 'week':
        dateGroup = "DATE_TRUNC('week', paid_date)";
        break;
      case 'month':
      default:
        dateGroup = "DATE_TRUNC('month', paid_date)";
        break;
    }

    let query = `
      SELECT 
        ${dateGroup} as period,
        COUNT(*) as transactions,
        SUM(amount) as revenue,
        AVG(amount) as avg_transaction
      FROM billing
      WHERE payment_status = 'paid'
    `;
    const params = [];

    if (start_date) {
      query += ` AND paid_date >= $${params.length + 1}`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND paid_date <= $${params.length + 1}`;
      params.push(end_date);
    }

    query += ` GROUP BY ${dateGroup} ORDER BY period DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    res.status(500).json({ error: 'Failed to fetch revenue report' });
  }
});

// Membership report
router.get('/memberships', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        mp.name as plan_name,
        COUNT(mm.id) as total_memberships,
        COUNT(CASE WHEN mm.status = 'active' THEN 1 END) as active_memberships,
        COUNT(CASE WHEN mm.end_date <= CURRENT_DATE + INTERVAL '7 days' AND mm.status = 'active' THEN 1 END) as expiring_soon,
        AVG(mp.price) as avg_price
      FROM membership_plans mp
      LEFT JOIN member_memberships mm ON mp.id = mm.plan_id
      GROUP BY mp.id, mp.name, mp.price
      ORDER BY total_memberships DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching membership report:', error);
    res.status(500).json({ error: 'Failed to fetch membership report' });
  }
});

// Member growth report
router.get('/member-growth', async (req, res) => {
  try {
    const { months = 12 } = req.query;

    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', join_date) as month,
        COUNT(*) as new_members,
        SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', join_date)) as cumulative_members
      FROM members
      WHERE join_date >= CURRENT_DATE - INTERVAL '${months} months'
      GROUP BY DATE_TRUNC('month', join_date)
      ORDER BY month
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching member growth report:', error);
    res.status(500).json({ error: 'Failed to fetch member growth report' });
  }
});

// Top members by attendance
router.get('/top-members', async (req, res) => {
  try {
    const { limit = 10, start_date, end_date } = req.query;

    let query = `
      SELECT 
        m.id, m.first_name, m.last_name, m.member_id,
        COUNT(a.id) as total_visits,
        MAX(a.check_in_time) as last_visit
      FROM members m
      LEFT JOIN attendance a ON m.id = a.member_id
    `;
    const params = [];

    if (start_date || end_date) {
      query += ' WHERE';
      const conditions = [];
      
      if (start_date) {
        conditions.push(` a.check_in_time >= $${params.length + 1}`);
        params.push(start_date);
      }
      
      if (end_date) {
        conditions.push(` a.check_in_time <= $${params.length + 1}`);
        params.push(end_date);
      }
      
      query += conditions.join(' AND ');
    }

    query += `
      GROUP BY m.id, m.first_name, m.last_name, m.member_id
      ORDER BY total_visits DESC
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching top members report:', error);
    res.status(500).json({ error: 'Failed to fetch top members report' });
  }
});

module.exports = router;