# Gym Management System - Backend API

A complete RESTful API for gym management system built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based auth system
- **Member Management**: Complete CRUD operations for gym members
- **Attendance Tracking**: Check-in/check-out system with history
- **Staff Management**: Employee records and role management
- **Billing System**: Payment tracking and revenue management
- **Workout Plans**: Create and assign custom workout routines
- **Reporting**: Comprehensive analytics and reports

## Quick Start

### Using Docker (Recommended)

1. Clone the repository
2. Run the complete system:
```bash
chmod +x install-gym-system.sh
./install-gym-system.sh
```

### Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Set up PostgreSQL database and run migrations:
```bash
# Create database and run init.sql
psql -U postgres -c "CREATE DATABASE gym_management;"
psql -U gym_admin -d gym_management -f database/init.sql
```

4. Start the server:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify` - Verify JWT token

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check in member
- `POST /api/attendance/checkout` - Check out member
- `GET /api/attendance/member/:id` - Get member's attendance history

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Deactivate staff member

### Billing
- `GET /api/billing` - Get billing records
- `GET /api/billing/:id` - Get billing record by ID
- `POST /api/billing` - Create billing record
- `PUT /api/billing/:id/payment` - Update payment status
- `GET /api/billing/member/:id` - Get member's billing history
- `GET /api/billing/summary/revenue` - Get revenue summary

### Workout Plans
- `GET /api/workouts` - Get workout plans
- `GET /api/workouts/:id` - Get workout plan with exercises
- `POST /api/workouts` - Create workout plan
- `PUT /api/workouts/:id` - Update workout plan
- `POST /api/workouts/:id/assign` - Assign workout to member
- `GET /api/workouts/member/:id/assignments` - Get member's workouts

### Reports
- `GET /api/reports/dashboard` - Dashboard summary
- `GET /api/reports/attendance` - Attendance report
- `GET /api/reports/revenue` - Revenue report
- `GET /api/reports/memberships` - Membership report
- `GET /api/reports/member-growth` - Member growth report
- `GET /api/reports/top-members` - Top members by attendance

## Database Schema

The system uses PostgreSQL with the following main tables:
- `users` - Staff and admin users
- `members` - Gym members
- `membership_plans` - Available membership plans
- `member_memberships` - Member subscription records
- `attendance` - Check-in/check-out records
- `staff` - Staff information
- `workout_plans` - Workout routines
- `workout_exercises` - Individual exercises in plans
- `member_workout_assignments` - Assigned workouts
- `billing` - Payment and billing records

## Default Login

After installation, use these credentials:
- **Email**: admin@gym.com
- **Password**: admin123

⚠️ **Change the default password immediately in production!**

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run database migrations
npm run migrate
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Update JWT_SECRET with a strong secret key
3. Configure proper database credentials
4. Set up SSL/TLS certificates
5. Configure reverse proxy (Nginx)
6. Set up monitoring and logging

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | API server port | 3001 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `NODE_ENV` | Environment mode | development |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details