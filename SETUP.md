# Cái Lò Nướng - E-commerce Cake Shop Setup

This is a full-featured e-commerce cake shop website built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- Product listing with category filtering
- Detailed product pages with image galleries, size selection, and add to cart
- Shopping cart with checkout functionality
- User authentication (login/signup)
- Admin dashboard with CRUD operations for:
  - Products
  - Categories
  - Orders
  - Reviews
  - User profiles
- Floating action buttons for social media and contact
- Responsive design optimized for all devices

## How to Create an Admin User

To access the admin dashboard, you need to create a user account and set it as admin.

### Step 1: Sign up for a new account

1. Go to the website and click "Sign In" button
2. Since there's no registration page yet, you'll need to create a user directly in Supabase

### Step 2: Create admin user via Supabase SQL Editor

Run the following SQL commands in your Supabase SQL Editor:

```sql
-- First, create a user in Supabase Auth (or use the Supabase Dashboard UI)
-- Then, after the user is created, run this to make them admin:

-- Replace 'USER_ID_HERE' with the actual user ID from auth.users table
UPDATE user_profiles
SET is_admin = true
WHERE id = 'USER_ID_HERE';
```

### Alternative: Direct SQL with email lookup

```sql
-- Find and update user by email
UPDATE user_profiles
SET is_admin = true
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

## Testing the Application

1. Browse products on the homepage
2. Click on a product to view details
3. Add products to cart with size selection
4. View cart and proceed to checkout
5. Login with admin credentials
6. Access admin dashboard at `/admin`
7. Manage products, categories, orders, and reviews

## Main Color Scheme

- Primary: Dark Green (#3E5D2A)
- Accent: Orange (#F97316)
- Background: White and Light Gray

## Navigation Menu

- TRANG CHỦ (Home)
- MENU BÁNH (Cakes Menu) - Dropdown with categories
- GIAO HÀNG (Delivery)
- LIÊN HỆ (Contact)
- CỬA HÀNG (Stores)
- KHÁCH HÀNG THÂN THIẾT (Loyalty Program)
- TIN TỨC (News)

## Database Schema

The application uses the following tables:
- `categories` - Product categories
- `products` - Cake products with details
- `product_images` - Additional product images
- `orders` - Customer orders
- `order_items` - Order line items
- `reviews` - Product reviews
- `user_profiles` - Extended user information

All tables have Row Level Security (RLS) enabled for data protection.
