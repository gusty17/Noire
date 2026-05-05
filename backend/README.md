# Noire E-Commerce API

A complete ASP.NET Core Web API for a perfume store e-commerce system built with clean architecture principles.

## Project Overview

This is a full-featured e-commerce backend API with:
- User authentication and authorization (JWT)
- Product management (CRUD operations)
- Shopping cart functionality
- Order processing
- Role-based access control (Admin/Customer)
- Entity Framework Core with PostgreSQL
- Swagger/OpenAPI documentation

## Architecture

The project follows **Clean Architecture** principles with the following structure:

```
backend/
├── Controllers/          # API endpoints
├── Services/            # Business logic implementation
├── Interfaces/          # Service contracts
├── Models/              # Entity models (database models)
├── DTOs/                # Data Transfer Objects
│   ├── Auth/           # Authentication DTOs
│   ├── Product/        # Product DTOs
│   ├── Order/          # Order DTOs
│   ├── Cart/           # Cart DTOs
│   └── User/           # User DTOs
├── Data/                # DbContext and database configuration
├── Auth/                # JWT token service and password hashing
├── Program.cs           # Application startup and configuration
├── Noire.Backend.csproj # Project file with dependencies
├── appsettings.json     # Configuration
└── appsettings.Development.json
```

## Key Features

### 1. **User Management**
- User registration and login
- JWT token-based authentication
- Role-based authorization (Admin/Customer)
- Password hashing using PBKDF2

### 2. **Product Management** (Admin only)
- Create, Read, Update, Delete products
- Search products by name or description
- Track product stock
- Product images and descriptions

### 3. **Shopping Cart**
- Add items to cart
- Update cart item quantities
- Remove items from cart
- Clear entire cart
- Automatic total calculation

### 4. **Orders**
- Create orders from cart
- View user orders
- View all orders (Admin)
- Order status tracking (Pending, Processing, Shipped, Delivered, Cancelled)
- Automatic stock reduction on order creation

## Database Schema

### Entities and Relationships

```
User (1) ──→ (1) Cart
User (1) ──→ (*) Order
Cart (1) ──→ (*) CartItem
Order (1) ──→ (*) OrderItem
Product (*) ←─→ (*) CartItem
Product (*) ←─→ (*) OrderItem
```

### Entity Details

**User**
- Id: int (Primary Key)
- Username: string
- PasswordHash: string
- Role: string (Admin/Customer)
- Cart: Cart (Navigation)
- Orders: ICollection<Order> (Navigation)

**Product**
- Id: int (Primary Key)
- Name: string
- Description: string
- Price: decimal
- Stock: int
- ImageUrl: string
- CreatedAt: DateTime
- UpdatedAt: DateTime

**Cart**
- Id: int (Primary Key)
- UserId: int (Foreign Key)
- User: User (Navigation)
- CreatedAt: DateTime
- CartItems: ICollection<CartItem> (Navigation)

**CartItem**
- Id: int (Primary Key)
- CartId: int (Foreign Key)
- ProductId: int (Foreign Key)
- Quantity: int
- Cart: Cart (Navigation)
- Product: Product (Navigation)

**Order**
- Id: int (Primary Key)
- UserId: int (Foreign Key)
- TotalPrice: decimal
- Status: string
- CreatedAt: DateTime
- UpdatedAt: DateTime
- User: User (Navigation)
- OrderItems: ICollection<OrderItem> (Navigation)

**OrderItem**
- Id: int (Primary Key)
- OrderId: int (Foreign Key)
- ProductId: int (Foreign Key)
- Quantity: int
- Price: decimal
- Order: Order (Navigation)
- Product: Product (Navigation)

## Prerequisites

- .NET 8.0 SDK or later
- PostgreSQL database
- Visual Studio 2022 / VS Code with C# extension

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE noire_db;
CREATE DATABASE noire_db_dev;
```

### 2. Configuration

Update the connection string in `appsettings.json` and `appsettings.Development.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=noire_db;Username=postgres;Password=YOUR_PASSWORD"
}
```

Change the JWT secret key for production:

```json
"Jwt": {
  "SecretKey": "your-super-secret-key-minimum-32-characters"
}
```

### 3. Install Dependencies

```bash
cd backend
dotnet restore
```

### 4. Run Database Migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

The application automatically applies migrations on startup.

### 5. Run the Application

```bash
dotnet run
```

The API will be available at: `https://localhost:7000`

Swagger UI: `https://localhost:7000/swagger`

## API Endpoints

### Authentication

**POST /api/auth/register**
- Register a new user
- Returns: AuthResponse with JWT token
- Body: `{ "username": "user", "password": "pass", "confirmPassword": "pass" }`

**POST /api/auth/login**
- Login user
- Returns: AuthResponse with JWT token
- Body: `{ "username": "user", "password": "pass" }`

### Products

**GET /api/products**
- Get all products
- No authentication required

**GET /api/products/{id}**
- Get product by ID
- No authentication required

**GET /api/products/search/{searchTerm}**
- Search products
- No authentication required

**POST /api/products** [Admin]
- Create new product
- Body: CreateProductDTO

**PUT /api/products/{id}** [Admin]
- Update product
- Body: UpdateProductDTO

**DELETE /api/products/{id}** [Admin]
- Delete product

### Cart

All cart endpoints require **Customer** role authorization.

**GET /api/cart**
- Get user's cart

**POST /api/cart/items**
- Add item to cart
- Body: `{ "productId": 1, "quantity": 2 }`

**PUT /api/cart/items/{cartItemId}**
- Update cart item quantity
- Body: `{ "quantity": 3 }`

**DELETE /api/cart/items/{cartItemId}**
- Remove item from cart

**DELETE /api/cart**
- Clear entire cart

### Orders

**GET /api/orders/{id}**
- Get order by ID
- Authorization: Owner or Admin

**GET /api/orders/my-orders** [Customer]
- Get user's orders

**GET /api/orders** [Admin]
- Get all orders

**POST /api/orders/create-from-cart** [Customer]
- Create order from cart
- Automatically clears cart

**PUT /api/orders/{id}/status** [Admin]
- Update order status
- Body: `{ "status": "Shipped" }`
- Valid statuses: Pending, Processing, Shipped, Delivered, Cancelled

## DTOs

### Auth DTOs
- **LoginRequest**: Username, Password
- **RegisterRequest**: Username, Password, ConfirmPassword
- **AuthResponse**: Id, Username, Token, Role

### Product DTOs
- **CreateProductDTO**: Name, Description, Price, Stock, ImageUrl
- **ProductReadDTO**: All product fields with timestamps
- **UpdateProductDTO**: Name, Description, Price, Stock, ImageUrl

### Cart DTOs
- **CreateCartItemDTO**: ProductId, Quantity
- **CartItemReadDTO**: Id, CartId, ProductId, Quantity, ProductName, ProductPrice, ItemTotal
- **UpdateCartItemDTO**: Quantity
- **CartReadDTO**: Id, UserId, CreatedAt, CartItems[], TotalPrice

### Order DTOs
- **OrderReadDTO**: Id, UserId, TotalPrice, Status, CreatedAt, UpdatedAt, OrderItems[]
- **OrderItemReadDTO**: Id, ProductId, ProductName, Quantity, Price, LineTotal

### User DTOs
- **UserReadDTO**: Id, Username, Role

## Authentication & Authorization

### JWT Token Structure

The JWT token includes the following claims:
- `NameIdentifier`: User ID
- `Name`: Username
- `Role`: User role (Admin/Customer)

### Roles

**Admin**
- Create, update, delete products
- View all orders
- Update order status

**Customer**
- View products
- Manage cart
- Create orders
- View own orders

## Service Layer

Each service implements its corresponding interface with the following patterns:

- **Async/Await**: All database operations are asynchronous
- **LINQ with Select()**: DTOs are created using LINQ projections
- **AsNoTracking()**: Read operations don't track entities
- **Error Handling**: Comprehensive exception handling and logging
- **Dependency Injection**: Services are injected via constructor

### Service Methods

**IProductService**
- `GetAllProductsAsync()`: Returns all products
- `GetProductByIdAsync(int id)`: Get product by ID
- `CreateProductAsync(CreateProductDTO)`: Create new product
- `UpdateProductAsync(int id, UpdateProductDTO)`: Update product
- `DeleteProductAsync(int id)`: Delete product
- `SearchProductsAsync(string searchTerm)`: Search products

**ICartService**
- `GetCartByUserIdAsync(int userId)`: Get user's cart
- `AddItemToCartAsync(int userId, CreateCartItemDTO)`: Add item
- `UpdateCartItemAsync(int cartItemId, UpdateCartItemDTO)`: Update quantity
- `RemoveCartItemAsync(int cartItemId)`: Remove item
- `ClearCartAsync(int userId)`: Clear cart

**IOrderService**
- `GetOrderByIdAsync(int id)`: Get order
- `GetUserOrdersAsync(int userId)`: Get user's orders
- `CreateOrderFromCartAsync(int userId)`: Create from cart
- `UpdateOrderStatusAsync(int id, string status)`: Update status
- `GetAllOrdersAsync()`: Get all orders (Admin)

**IUserService**
- `GetUserByIdAsync(int id)`: Get user
- `GetUserByUsernameAsync(string username)`: Get by username
- `RegisterAsync(RegisterRequest)`: Register new user
- `LoginAsync(LoginRequest)`: Login user
- `UserExistsAsync(string username)`: Check username availability

## Security Features

1. **Password Hashing**: PBKDF2 with SHA256, 10,000 iterations
2. **JWT Tokens**: Signed with HS256, configurable expiration
3. **Role-Based Access Control**: Endpoint authorization by role
4. **CORS**: Configured for frontend integration
5. **SQL Injection Prevention**: Parameterized queries via EF Core
6. **HTTPS**: Enforced in production

## Configuration

### JWT Settings (appsettings.json)
```json
"Jwt": {
  "SecretKey": "your-secret-key",
  "Issuer": "NoireECommerceAPI",
  "Audience": "NoireECommerceApp",
  "ExpirationMinutes": 60
}
```

### CORS Settings
Currently allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

Add your frontend URL to `Program.cs` if different.

### Database Connection
Update `DefaultConnection` in appsettings.json for your database credentials.

## Development

### Running Tests
```bash
dotnet test
```

### Building for Production
```bash
dotnet publish -c Release -o ./publish
```

### Database Migrations
```bash
# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove migration
dotnet ef migrations remove

# View migrations
dotnet ef migrations list
```

## Common Issues

### Database Connection Failed
- Ensure PostgreSQL is running
- Check connection string and credentials
- Verify database name

### JWT Token Invalid
- Ensure `SecretKey` is configured
- Check token expiration time
- Verify token format in Authorization header

### Swagger Not Loading
- Access at `/swagger` endpoint
- Ensure `UseSwagger()` is enabled in Program.cs
- Check console for errors

## Frontend Integration

### Using the API

**Register/Login:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

**Protected Requests:**
```javascript
const response = await fetch('/api/cart', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## License

This project is part of the Noire E-Commerce System.

## Support

For issues or questions, please refer to the API documentation in Swagger UI.
