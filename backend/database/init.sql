-- Gym Management System Database Schema

-- Users table (staff/admin)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    join_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membership plans
CREATE TABLE membership_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Member memberships
CREATE TABLE member_memberships (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),
    plan_id INTEGER REFERENCES membership_plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    payment_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),
    check_in_time TIMESTAMP NOT NULL,
    check_out_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff records
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    position VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(10,2),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout plans
CREATE TABLE workout_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50),
    duration_minutes INTEGER,
    created_by INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout exercises
CREATE TABLE workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_plan_id INTEGER REFERENCES workout_plans(id),
    exercise_name VARCHAR(200) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(5,2),
    duration_seconds INTEGER,
    rest_seconds INTEGER,
    order_index INTEGER,
    notes TEXT
);

-- Member workout assignments
CREATE TABLE member_workout_assignments (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),
    workout_plan_id INTEGER REFERENCES workout_plans(id),
    assigned_by INTEGER REFERENCES users(id),
    assigned_date DATE NOT NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing records
CREATE TABLE billing (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    due_date DATE,
    paid_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default membership plans
INSERT INTO membership_plans (name, description, price, duration_months, features) VALUES
('Basic Monthly', 'Access to gym facilities during regular hours', 49.99, 1, '{"Gym Access", "Locker Room"}'),
('Premium Monthly', 'Full access with group classes', 79.99, 1, '{"Gym Access", "Group Classes", "Locker Room", "Guest Passes"}'),
('Annual Basic', 'Basic plan with annual discount', 499.99, 12, '{"Gym Access", "Locker Room", "Annual Discount"}'),
('Annual Premium', 'Premium plan with annual discount', 799.99, 12, '{"Gym Access", "Group Classes", "Personal Training", "Locker Room", "Guest Passes"}');

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@gym.com', '$2a$10$K7L/qZ0YbW8PqhHxDRDQ5.NVqBjF8xLK8pJxHQN9w1E.F2QqN8UO2', 'Admin', 'User', 'admin');