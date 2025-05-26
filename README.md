markdown# MachzaulMart - E-commerce Platform

![MachzaulMart](https://img.shields.io/badge/MachzaulMart-E--commerce-8B5CF6?style=for-the-badge&logo=shopping-cart)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

MachzaulMart adalah platform e-commerce modern yang dibangun dengan teknologi terkini untuk memberikan pengalaman berbelanja online yang optimal. Platform ini menggabungkan antarmuka yang elegan dengan fungsionalitas yang lengkap untuk pengelolaan toko online.

## 🚀 Fitur Utama

- ✅ **Dashboard Admin** - Kelola produk, pesanan, dan inventori dengan mudah
- ✅ **Manajemen Pesanan** - Lacak status pesanan dari pending hingga completed
- ✅ **Sistem Checkout** - Proses pembayaran yang aman dan user-friendly
- ✅ **Manajemen Inventori** - Pantau stok produk secara real-time
- ✅ **Interface Responsif** - Tampilan yang optimal di semua perangkat
- ✅ **Pelacakan Pesanan** - Fitur tracking untuk pelanggan
- ✅ **Multi-kategori Produk** - Mendukung berbagai jenis produk
- ✅ **Notifikasi Real-time** - Update status pesanan secara langsung

## 🛠️ Tech Stack

### Frontend
├── React.js 18+           # UI Library
├── Tailwind CSS 3+        # Styling Framework
├── React Router v6        # Client-side Routing
├── Axios                  # HTTP Client
├── React Hooks            # State Management
└── Responsive Design      # Mobile-first Approach

### Backend
├── Python 3.8+            # Programming Language
├── Pyramid Framework      # Web Framework
├── SQLAlchemy            # ORM
├── Waitress              # WSGI Server
├── Alembic               # Database Migration
└── JWT Authentication    # Security

## 📋 Prerequisites

Pastikan sistem Anda telah terinstall:

- ![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js) **Node.js** (v16 atau lebih baru)
- ![npm](https://img.shields.io/badge/npm-8+-CB3837?logo=npm) **npm** atau **yarn**
- ![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python) **Python** (v3.8 atau lebih baru)
- ![pip](https://img.shields.io/badge/pip-latest-3776AB) **pip** (Python package installer)
- ![Git](https://img.shields.io/badge/Git-latest-F05032?logo=git) **Git**

## 🔧 Installation

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/machzaulmart.git

# Navigate to project directory
cd machzaulmart
2. Backend Setup (Python Pyramid)
bash# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# For Windows:
venv\Scripts\activate

# For macOS/Linux:
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Setup database
python setup.py develop

# Initialize database
initialize_db development.ini

# Run backend server
pserve development.ini --reload
✅ Backend akan berjalan di: http://localhost:6543
3. Frontend Setup (React + Tailwind)
bash# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
✅ Frontend akan berjalan di: http://localhost:3000
📁 Project Structure
machzaulmart/
│
├── 📁 backend/                    # Python Pyramid Backend
│   ├── 📁 machzaulmart/
│   │   ├── 📁 models/            # Database Models
│   │   ├── 📁 views/             # API Views/Controllers
│   │   ├── 📁 static/            # Static Files
│   │   └── 📁 templates/         # HTML Templates
│   ├── 📄 requirements.txt       # Python Dependencies
│   ├── 📄 setup.py              # Package Setup
│   ├── 📄 development.ini       # Development Config
│   └── 📄 production.ini        # Production Config
│
├── 📁 frontend/                   # React Frontend
│   ├── 📁 public/               # Public Assets
│   ├── 📁 src/
│   │   ├── 📁 components/       # React Components
│   │   │   ├── 📁 admin/        # Admin Components
│   │   │   ├── 📁 common/       # Shared Components
│   │   │   └── 📁 customer/     # Customer Components
│   │   ├── 📁 pages/            # Page Components
│   │   ├── 📁 utils/            # Utility Functions
│   │   ├── 📁 hooks/            # Custom Hooks
│   │   ├── 📁 services/         # API Services
│   │   └── 📁 styles/           # CSS Styles
│   ├── 📄 package.json          # Node Dependencies
│   ├── 📄 tailwind.config.js    # Tailwind Configuration
│   └── 📄 craco.config.js       # Create React App Config
│
├── 📄 README.md                  # Project Documentation
├── 📄 .gitignore               # Git Ignore Rules
└── 📄 LICENSE                   # License File
⚙️ Configuration
Backend Environment (.env)
Buat file .env di direktori backend/:
env# Database Configuration
DATABASE_URL=sqlite:///machzaulmart.db
# DATABASE_URL=postgresql://user:password@localhost/machzaulmart

# Security
SECRET_KEY=your-super-secret-key-here-change-in-production
JWT_SECRET=your-jwt-secret-key

# Application Settings
DEBUG=True
CORS_ORIGINS=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
Frontend Environment (.env)
Buat file .env di direktori frontend/:
env# API Configuration
REACT_APP_API_URL=http://localhost:6543
REACT_APP_API_VERSION=v1

# Application Settings
REACT_APP_APP_NAME=MachzaulMart
REACT_APP_APP_VERSION=1.0.0

# Features Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_NOTIFICATIONS=true
📄 requirements.txt
txt# Web Framework
pyramid==2.0.2
pyramid-chameleon==0.3
pyramid-debugtoolbar==4.10.1

# Database
SQLAlchemy==1.4.46
alembic==1.9.2
psycopg2-binary==2.9.5

# WSGI Server
waitress==2.1.2

# CORS Support
pyramid-cors==2.0.0

# Authentication & Security
pyramid-jwt==1.6.1
bcrypt==4.0.1

# HTTP & JSON
requests==2.28.2
webob==1.8.7

# Development Tools
pyramid-retry==2.1.1
pyramid-tm==2.5

# Utilities
python-dotenv==0.21.1
marshmallow==3.19.0
🗃️ Database Setup
SQLite (Development)
bashcd backend
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Initialize database
initialize_db development.ini

# (Optional) Seed sample data
python scripts/seed_data.py
PostgreSQL (Production)
bash# Install PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS:
brew install postgresql

# Create database
sudo -u postgres createdb machzaulmart

# Update .env file with PostgreSQL URL
# DATABASE_URL=postgresql://username:password@localhost/machzaulmart
🚀 Deployment
Production Build
Backend (Waitress)
bashcd backend
source venv/bin/activate

# Install production dependencies
pip install waitress

# Run with Waitress
waitress-serve --port=6543 --call machzaulmart:main
Frontend (Static Build)
bashcd frontend

# Create production build
npm run build

# Serve static files (optional)
npm install -g serve
serve -s build -l 3000
Docker Deployment (Optional)
dockerfile# Dockerfile.backend
FROM python:3.9-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["waitress-serve", "--port=6543", "--call", "machzaulmart:main"]
dockerfile# Dockerfile.frontend  
FROM node:16-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
📱 Screenshots & Features
🏠 Homepage

Hero section dengan produk unggulan
Kategori produk yang terorganisir
Testimoni pelanggan

👨‍💼 Admin Dashboard

Overview statistik penjualan
Manajemen produk (CRUD)
Monitoring pesanan real-time
Laporan keuangan

🛒 Shopping Experience

Katalog produk dengan filter
Keranjang belanja interaktif
Checkout process yang streamlined
Order tracking untuk pelanggan

📱 Responsive Design

Mobile-first approach
Tablet optimization
Desktop full features

🧪 Testing
Backend Testing
bashcd backend
source venv/bin/activate

# Install test dependencies
pip install pytest pytest-cov

# Run tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=machzaulmart --cov-report=html
Frontend Testing
bashcd frontend

# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run e2e tests (if configured)
npm run test:e2e
📋 API Documentation
Authentication
bash# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
Products API
MethodEndpointDescriptionAuth RequiredGET/api/productsGet all products❌GET/api/products/{id}Get single product❌POST/api/productsCreate product✅ AdminPUT/api/products/{id}Update product✅ AdminDELETE/api/products/{id}Delete product✅ Admin
Orders API
MethodEndpointDescriptionAuth RequiredGET/api/ordersGet all orders✅ AdminGET/api/orders/{id}Get order details✅POST/api/ordersCreate new order❌PUT/api/orders/{id}Update order status✅ Admin
Sample API Responses
json// GET /api/products
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Bitcoin",
        "description": "melelit pasti kaya",
        "price": 3000000,
        "stock": 10,
        "image_url": "/static/images/bitcoin.jpg",
        "created_at": "2025-05-26T10:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "per_page": 10
  }
}
json// POST /api/orders
{
  "success": true,
  "data": {
    "order_id": "47722553-ptry25hjf",
    "status": "pending",
    "total": 8000000,
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "price": 3000000
      }
    ]
  }
}
🤝 Contributing
Kami menyambut kontribusi dari developer manapun! Berikut cara berkontribusi:
1. Fork & Clone
bash# Fork repository di GitHub
# Kemudian clone fork Anda
git clone https://github.com/yourusername/machzaulmart.git
2. Create Feature Branch
bash# Buat branch baru untuk fitur
git checkout -b feature/amazing-feature

# Atau untuk bug fix
git checkout -b fix/bug-description
3. Commit Changes
bash# Add changes
git add .

# Commit with descriptive message
git commit -m "Add: amazing new feature

- Implement user authentication
- Add email verification
- Update UI components"
4. Push & Pull Request
bash# Push ke fork Anda
git push origin feature/amazing-feature

# Buat Pull Request di GitHub
Code Style Guidelines

Python: Follow PEP 8
JavaScript: Use ESLint configuration
Git Commits: Use conventional commits
Documentation: Update README untuk perubahan major

🐛 Troubleshooting
Common Issues & Solutions
Backend Issues
❌ ModuleNotFoundError: No module named 'machzaulmart'
bash# Solution:
cd backend
source venv/bin/activate
python setup.py develop
❌ Database connection error
bash# For SQLite:
rm machzaulmart.db
initialize_db development.ini

# For PostgreSQL:
# Check database credentials in .env
# Ensure PostgreSQL service is running
❌ Port 6543 already in use
bash# Find and kill process
lsof -ti:6543 | xargs kill -9

# Or use different port
pserve development.ini --reload --port=6544
Frontend Issues
❌ npm install fails
bash# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
❌ Tailwind styles not working
bash# Ensure Tailwind is properly configured
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
❌ CORS errors in browser
bash# Check backend CORS configuration
# Ensure CORS_ORIGINS includes frontend URL
Debug Mode
Backend Debug
bash# Enable debug mode
export DEBUG=true
pserve development.ini --reload
Frontend Debug
bash# Start with verbose logging
REACT_APP_LOG_LEVEL=debug npm start
📞 Support & Contact
Jika Anda mengalami masalah atau membutuhkan bantuan:

📧 Email: machzaul17@gmail.com
📱 Phone: +62 856 9450 8422
💬 WhatsApp: +62 856 9450 8422
📍 Location: Padang, Indonesia
🐛 Issues: GitHub Issues
📖 Docs: Wiki Documentation

Business Hours

Customer Support: 24/7 Response
Development Support: Mon-Fri, 9AM-5PM (WIB)

📈 Roadmap
Version 1.1 (Q3 2025)

 Payment Gateway Integration (Midtrans/Stripe)
 Real-time Chat Support
 Advanced Analytics Dashboard
 Mobile App (React Native)

Version 1.2 (Q4 2025)

 Multi-vendor Support
 Inventory Forecasting
 Advanced Search & Filters
 Social Media Integration

Version 2.0 (2026)

 AI-powered Recommendations
 Blockchain Integration
 Advanced Security Features
 Global Expansion Tools

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
MIT License

Copyright (c) 2025 MachzaulMart

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
🙏 Acknowledgments
Terima kasih kepada semua pihak yang berkontribusi:

🏗️ React Team - Untuk framework JavaScript yang luar biasa
🎨 Tailwind CSS Team - Untuk utility-first CSS framework
🐍 Pyramid Community - Untuk web framework Python yang powerful
🌟 Open Source Community - Untuk semua library dan tools yang digunakan
👥 Beta Testers - Untuk feedback dan testing
🎯 Early Adopters - Untuk kepercayaan menggunakan platform kami

📊 Project Stats
Show Image
Show Image
Show Image
Show Image
Show Image

<div align="center">
🛍️ MachzaulMart - Transformasi Belanja Global
Dibuat dengan ❤️ oleh Tim MachzaulMart
🚀 Live Demo | 📚 Documentation | 🐛 Report Bug
</div>
```