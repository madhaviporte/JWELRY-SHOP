# ✨ Lumiere

A full-stack jewelry e-commerce website built with React, Node.js, Express, and MongoDB.

Lumiere lets users explore jewelry products, manage their cart and wishlist, save delivery addresses, and make payments through Razorpay. The project is built with a focus on a clean shopping experience, responsive design, secure authentication, and proper production deployment.

## 🌐 Live Demo

https://jwelry-shop-alpha.vercel.app/

## ✨ Features

- User registration and login
- JWT authentication with HTTP-only cookies
- Protected routes
- Browse jewelry products
- Product categories
- Product filtering
- Product details
- Add to Cart
- Remove from Cart
- Increase/decrease quantity
- Wishlist
- Save delivery address
- Buy Now
- Razorpay payment integration
- Backend payment verification
- Responsive UI
- Mobile, tablet and desktop support
- SPA routing with refresh support
- Local and production environment support

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- HTTP-only Cookies

### Payment
- Razorpay

### Deployment
- Vercel
- Render
- MongoDB Atlas

## 📂 Project Structure

```text
Lumiere/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
│
└── README.md
🔐 Authentication

Authentication is handled using JWT and HTTP-only cookies.

Register / Login
       ↓
Backend validates user
       ↓
JWT generated
       ↓
HTTP-only cookie
       ↓
Authenticated requests
       ↓
Protected APIs

The authentication system protects features such as Cart, Wishlist, Address and Payment.

🛒 Cart & Wishlist

Users can manage their shopping experience directly from their account.

Cart
Add products
Remove products
Increase quantity
Decrease quantity
View total price
Buy Now
Wishlist
Add products
Remove products
View saved products
💳 Payment

Razorpay is used for payment processing.

User clicks Buy Now / Checkout
          ↓
Backend creates Razorpay order
          ↓
Razorpay Checkout opens
          ↓
User completes payment
          ↓
Payment details returned
          ↓
Backend verifies payment
          ↓
Payment confirmed

The Razorpay secret key is stored only on the backend and is never exposed to the frontend.

🌍 Deployment

The frontend and backend are deployed separately.

User
 ↓
Vercel
 ↓
React Frontend
 ↓
Render
 ↓
Express Backend
 ↓
MongoDB Atlas
Frontend

https://jwelry-shop-alpha.vercel.app/

Backend

https://jwelry-shop.onrender.com/

📱 Responsive Design

The website is designed to work across:

Mobile
Tablet
Laptop
Desktop

The layout adjusts product cards, navigation, shopping sections, cart and checkout screens according to the screen size.

🧩 Challenges & Fixes
Production Authentication

Authentication worked correctly in local development but protected APIs returned Not authorized after deployment.

The issue was caused by cross-origin cookies and CORS because the frontend and backend were hosted on different domains.

The production cookie and CORS configuration were updated while keeping the local setup unchanged.

React Router Refresh

Routes worked when navigating through the website, but refreshing a route such as /shop returned a 404 on Vercel.

Since React Router handles navigation on the client side, Vercel needed an SPA rewrite configuration to redirect frontend routes to index.html.

API Routing

The frontend initially used routes like:

/auth/login
/auth/register
/auth/me

while the backend routes were under:

/api/auth

The API configuration was centralized using Axios and the correct /api base path was configured for development and production.

⚙️ Local Setup

Clone the repository:

git clone https://github.com/madhaviporte/JWELRY-SHOP.git
cd JWELRY-SHOP

Install frontend dependencies:

cd client
npm install

Install backend dependencies:

cd ../server
npm install
🔑 Environment Variables
Client

Create client/.env:

VITE_API_URL=/api
VITE_RAZORPAY_KEY=your_razorpay_key
Server

Create server/.env:

PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

Never commit real environment variables or secret keys to GitHub.

▶️ Run Locally

Start the backend:

cd server
npm run dev

Start the frontend:

cd client
npm run dev

Open:

http://localhost:5173
📌 Main API Routes
/api/auth/register
/api/auth/login
/api/auth/me
/api/auth/logout

/api/products
/api/cart
/api/wishlist
/api/address
/api/payment
🔮 Future Improvements
Admin dashboard
Product reviews and ratings
Order history
Better product search
Coupons and discounts
Product recommendations
Order tracking
Email notifications
👩‍💻 Author
Madhavi Porte

Full Stack Developer

GitHub: https://github.com/madhaviporte

LinkedIn: https://www.linkedin.com/in/madhavi-porte-091219329/

⭐ If you like Lumiere, consider giving the repository a star.
