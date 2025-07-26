# Gym Management System

A complete self-hosted gym management solution with frontend, backend API, and database.

## 🏋️ Features

### Frontend (React + TypeScript)
- Modern dashboard with key metrics
- Member management system
- Attendance tracking interface
- Staff management
- Billing and payments
- Workout plan management
- Responsive design with Tailwind CSS

### Backend (Node.js + Express)
- RESTful API with JWT authentication
- Complete CRUD operations
- Role-based access control
- Comprehensive reporting system
- Rate limiting and security headers

### Database (PostgreSQL)
- Optimized schema for gym operations
- Member and staff management
- Attendance tracking
- Billing and subscription system
- Workout plan storage

## 🚀 Quick Start

### One-Click Installation

```bash
git clone https://github.com/kaustubh6199/gym-flow-master.git
cd gym-flow-master
chmod +x install-gym-system.sh
./install-gym-system.sh
```

This script will:
- Install Docker and dependencies
- Set up the complete system with database
- Configure networking and security
- Start all services

### Manual Setup

1. **Prerequisites**
   - Docker and Docker Compose
   - Node.js 18+ (for development)
   - PostgreSQL 15+ (if not using Docker)

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Start Services**
   ```bash
   docker compose up -d
   ```

## 🌐 Access Points

After installation:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

### Default Login
- **Email**: admin@gym.com
- **Password**: admin123

⚠️ **Change default credentials before production use!**

## 📁 Project Structure

```
gym-flow-master/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   └── lib/               # Utilities and helpers
├── backend/               # Backend API server
│   ├── routes/            # API route handlers
│   ├── database/          # Database schema and migrations
│   └── middleware/        # Authentication and validation
├── docker-compose.yml     # Multi-container Docker setup
├── nginx.conf            # Reverse proxy configuration
└── install-gym-system.sh # One-click installer
```

## 🔧 Configuration

### Environment Variables

**Frontend** (.env):
```bash
VITE_API_URL=http://localhost:3001/api
```

**Backend** (backend/.env):
```bash
DATABASE_URL=postgresql://gym_admin:gym_secure_2024@postgres:5432/gym_management
JWT_SECRET=your_super_secure_jwt_secret_key
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Database Configuration

Default PostgreSQL settings:
- **Host**: localhost
- **Port**: 5432
- **Database**: gym_management
- **Username**: gym_admin
- **Password**: gym_secure_2024

## 📊 API Documentation

### Authentication
```bash
POST /api/auth/login
POST /api/auth/register
GET /api/auth/verify
```

### Core Resources
```bash
# Members
GET /api/members
POST /api/members
PUT /api/members/:id
DELETE /api/members/:id

# Attendance
POST /api/attendance/checkin
POST /api/attendance/checkout
GET /api/attendance/member/:id

# Billing
GET /api/billing
POST /api/billing
PUT /api/billing/:id/payment

# Reports
GET /api/reports/dashboard
GET /api/reports/revenue
GET /api/reports/attendance
```

## 🛠️ Development

### Frontend Development
```bash
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Database Migrations
```bash
cd backend
npm run migrate
```

## 📱 Deployment Options

### Self-Hosted (Docker)
- Complete containerized setup
- Includes reverse proxy with Nginx
- Automatic SSL/TLS with Certbot (optional)

### Cloud Deployment
- Frontend: Vercel, Netlify
- Backend: Railway, Heroku, DigitalOcean
- Database: AWS RDS, Google Cloud SQL

### VPS Deployment
- Ubuntu 20.04+ recommended
- 2GB RAM minimum
- 20GB storage minimum

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests/15min)
- CORS protection
- SQL injection prevention
- XSS protection headers

## 📈 Monitoring & Logging

### Docker Logs
```bash
# View all service logs
docker compose logs

# View specific service
docker compose logs frontend
docker compose logs backend
docker compose logs postgres
```

### Health Checks
- Backend: http://localhost:3001/health
- Database: Included in Docker health checks

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   sudo lsof -i :3000
   sudo lsof -i :3001
   ```

2. **Database Connection Failed**
   ```bash
   # Check PostgreSQL status
   docker compose ps
   docker compose logs postgres
   ```

3. **Frontend Build Errors**
   ```bash
   # Clear cache and rebuild
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

### Reset System
```bash
# Stop all services
docker compose down

# Remove volumes (WARNING: Deletes all data)
docker compose down -v

# Restart fresh
docker compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for UI components
- [Lucide React](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [PostgreSQL](https://postgresql.org/) for database

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Made with ❤️ for gym owners and fitness professionals**
