const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Get all workout plans
router.get('/', async (req, res) => {
  try {
    const { is_public, created_by, limit = 50 } = req.query;
    
    let query = `
      SELECT wp.*, u.first_name as creator_first_name, u.last_name as creator_last_name,
             COUNT(we.id) as exercise_count
      FROM workout_plans wp
      LEFT JOIN users u ON wp.created_by = u.id
      LEFT JOIN workout_exercises we ON wp.id = we.workout_plan_id
    `;
    const params = [];
    const conditions = [];

    if (is_public !== undefined) {
      conditions.push(`wp.is_public = $${params.length + 1}`);
      params.push(is_public === 'true');
    }

    if (created_by) {
      conditions.push(`wp.created_by = $${params.length + 1}`);
      params.push(created_by);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY wp.id, u.first_name, u.last_name ORDER BY wp.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    res.status(500).json({ error: 'Failed to fetch workout plans' });
  }
});

// Get workout plan by ID with exercises
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get workout plan details
    const planResult = await pool.query(`
      SELECT wp.*, u.first_name as creator_first_name, u.last_name as creator_last_name
      FROM workout_plans wp
      LEFT JOIN users u ON wp.created_by = u.id
      WHERE wp.id = $1
    `, [id]);
    
    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    // Get exercises for this plan
    const exercisesResult = await pool.query(`
      SELECT * FROM workout_exercises 
      WHERE workout_plan_id = $1 
      ORDER BY order_index ASC
    `, [id]);

    const workoutPlan = planResult.rows[0];
    workoutPlan.exercises = exercisesResult.rows;
    
    res.json(workoutPlan);
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    res.status(500).json({ error: 'Failed to fetch workout plan' });
  }
});

// Create new workout plan
router.post('/', async (req, res) => {
  try {
    const { 
      name, description, difficulty_level, duration_minutes, 
      created_by, is_public, exercises 
    } = req.body;

    // Create workout plan
    const planResult = await pool.query(`
      INSERT INTO workout_plans (name, description, difficulty_level, duration_minutes, created_by, is_public)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, difficulty_level, duration_minutes, created_by, is_public]);

    const workoutPlan = planResult.rows[0];

    // Add exercises if provided
    if (exercises && exercises.length > 0) {
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        await pool.query(`
          INSERT INTO workout_exercises 
          (workout_plan_id, exercise_name, sets, reps, weight, duration_seconds, rest_seconds, order_index, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          workoutPlan.id, exercise.exercise_name, exercise.sets, exercise.reps,
          exercise.weight, exercise.duration_seconds, exercise.rest_seconds, i + 1, exercise.notes
        ]);
      }
    }

    res.status(201).json(workoutPlan);
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({ error: 'Failed to create workout plan' });
  }
});

// Update workout plan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, difficulty_level, duration_minutes, is_public } = req.body;

    const result = await pool.query(`
      UPDATE workout_plans SET
        name = $1, description = $2, difficulty_level = $3, 
        duration_minutes = $4, is_public = $5
      WHERE id = $6
      RETURNING *
    `, [name, description, difficulty_level, duration_minutes, is_public, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating workout plan:', error);
    res.status(500).json({ error: 'Failed to update workout plan' });
  }
});

// Assign workout plan to member
router.post('/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { member_id, assigned_by, start_date, end_date } = req.body;

    const result = await pool.query(`
      INSERT INTO member_workout_assignments 
      (member_id, workout_plan_id, assigned_by, assigned_date, start_date, end_date)
      VALUES ($1, $2, $3, CURRENT_DATE, $4, $5)
      RETURNING *
    `, [member_id, id, assigned_by, start_date, end_date]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error assigning workout plan:', error);
    res.status(500).json({ error: 'Failed to assign workout plan' });
  }
});

// Get member's workout assignments
router.get('/member/:id/assignments', async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'active' } = req.query;

    const result = await pool.query(`
      SELECT mwa.*, wp.name as workout_name, wp.description, wp.difficulty_level,
             u.first_name as assigned_by_first_name, u.last_name as assigned_by_last_name
      FROM member_workout_assignments mwa
      JOIN workout_plans wp ON mwa.workout_plan_id = wp.id
      LEFT JOIN users u ON mwa.assigned_by = u.id
      WHERE mwa.member_id = $1 AND mwa.status = $2
      ORDER BY mwa.assigned_date DESC
    `, [id, status]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching member workout assignments:', error);
    res.status(500).json({ error: 'Failed to fetch member workout assignments' });
  }
});

module.exports = router;