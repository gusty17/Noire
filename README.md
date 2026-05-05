# 🖤 NOIRE – E-Commerce Perfume Store

A full-stack e-commerce web application for luxury perfumes, built with **React (Frontend)** and **ASP.NET Core Web API (Backend)** with **PostgreSQL**.

---

## 🚀 Features

### 👤 Authentication
- User registration & login
- JWT-based authentication
- Role-based access (Admin / Customer)

### 🛍️ Products
- View all products
- View product details
- Filter by brand & collection
- Image upload support (admin)

### 🛒 Cart
- Add to cart
- Remove from cart
- View cart items
- Protected (login required)

### 🧾 Orders
- Checkout system
- Create orders from cart
- View user orders

### 👑 Admin Panel
- Create products
- Upload product images
- Manage products (CRUD)
- Manage brands & collections

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router
- Context API (Auth + Cart)

### Backend
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Swagger (API testing)

---

## 📁 Project Structure
noire/
│
├── frontend/ # React app
│
├── backend/ # ASP.NET Core API
│ ├── Controllers/
│ ├── Services/
│ ├── Models/
│ ├── DTOs/
│ ├── Interfaces/
│ └── Data/

## ⚙️ Setup Instructions

### 🔹 Backend Setup

1. Navigate to backend:
```bash
cd backend
dotnet restore

Configure database in appsettings.json:
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=noire_db;Username=postgres;Password=YOUR_PASSWORD"}

dotnet ef migrations add InitialCreate
dotnet ef database update

dotnet run

http://localhost:5000