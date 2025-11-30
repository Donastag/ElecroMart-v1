# Environment Setup Guide

This guide will help you set up the complete environment for Elecro.Mart E-commerce Platform.

## 🚀 Quick Setup

### 1. Supabase Project Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials** from Settings → API
3. **Copy the database connection string** from Settings → Database

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

#### Required Environment Variables:

```env
# Database Connection (Supabase PostgreSQL)
DATABASE_URI=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=[YOUR-GEMINI-API-KEY]

# Payload CMS Configuration
PAYLOAD_SECRET=[GENERATE-A-SECURE-32+ CHARACTER-SECRET]
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# S3 Storage (Optional - for media uploads)
S3_ACCESS_KEY_ID=[YOUR-S3-ACCESS-KEY]
S3_SECRET_ACCESS_KEY=[YOUR-S3-SECRET-KEY]
S3_ENDPOINT=[YOUR-S3-ENDPOINT]
S3_REGION=[YOUR-S3-REGION]

# Node Environment
NODE_ENV=development
```

### 3. Database Setup

#### Option A: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Run the script to set up all tables, indexes, and functions

#### Option B: Command Line

If you have direct database access:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres" -f database-setup.sql
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Generate Payload Types

```bash
npm run generate:types
```

### 6. Start Development Server

```bash
npm run dev
```

## 🔧 Detailed Configuration

### Supabase Setup

#### Database Extensions
Ensure these extensions are enabled in Supabase:
- `uuid-ossp` - For UUID generation
- `pgcrypto` - For encryption functions
- `vector` - For AI-powered product recommendations (pgvector)

#### Row Level Security (RLS)
RLS is enabled on all tables with appropriate policies:
- Public read access for products, categories, and approved reviews
- User-specific access for orders and customer data
- Admin access for all operations

#### Storage Buckets
Create these storage buckets in Supabase:
- `product-images` - For product photos
- `category-images` - For category banners
- `media` - General media files

### Payload CMS Setup

#### Collections Created:
1. **Users** - Admin and staff authentication
2. **Products** - Product catalog with inventory
3. **Categories** - Hierarchical product categories
4. **Orders** - Customer orders
5. **OrderItems** - Order line items
6. **Customers** - Customer profiles
7. **Reviews** - Product reviews and ratings

#### Access Control:
- **Admin/Manager**: Full CRUD access
- **Authenticated Users**: Read access to public data, manage own orders
- **Public**: Read access to products, categories, approved reviews

### Gemini AI Integration

#### Features Enabled:
- **Product Image Generation** - AI-generated images for products without photos
- **Product Recommendations** - Personalized suggestions using embeddings
- **Content Generation** - Automated product descriptions
- **Search Enhancement** - Semantic search capabilities

## 🔐 Security Configuration

### Row Level Security (RLS) Policies

All tables have RLS enabled with these security levels:

```sql
-- Public read access (products, categories, approved reviews)
CREATE POLICY "Allow public read access" ON [table] FOR SELECT USING ([condition]);

-- User-specific access (orders, customer data)
CREATE POLICY "Users access own data" ON [table] FOR [operation] USING ([condition]);

-- Admin/Manager access
CREATE POLICY "Admin/Manager full access" ON [table] FOR ALL USING (is_admin_or_manager());
```

### Authentication Strategy

**Hybrid Authentication**:
- **Supabase Auth**: Customer authentication (signup, login, password reset)
- **Payload Auth**: Admin/staff authentication for CMS access

## 🗄️ Database Schema

### Key Tables:
- `products` - Product catalog with pricing, inventory, images
- `categories` - Hierarchical category structure
- `orders` - Customer orders with payment status
- `order_items` - Order line items with pricing
- `customers` - Customer profiles and addresses
- `reviews` - Product reviews and ratings
- `product_embeddings` - AI embeddings for recommendations

### Automatic Triggers:
- **Rating Updates**: Automatically updates product ratings when reviews change
- **Order Totals**: Automatically calculates order subtotals and taxes
- **Inventory Tracking**: Low stock alerts and automatic updates
- **Slug Generation**: Automatic URL-friendly slugs for products and categories

## 📊 Analytics & Monitoring

### Key Metrics Tracked:
- Product view counts
- Order conversion rates
- Customer lifetime value
- Inventory turnover
- Review ratings distribution

### Built-in Reports:
- Sales reports by time period
- Top-selling products
- Customer acquisition analysis
- Inventory status reports

## 🚀 Deployment

### Development:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
npm start
```

### Environment Variables for Production:
Update these for production deployment:
- `NODE_ENV=production`
- `NEXT_PUBLIC_SERVER_URL=[your-production-domain]`
- Use production database credentials
- Set up proper CORS origins

## 🧪 Testing

### Test Data:
- Sample products with various categories
- Test customers with different order histories
- Sample reviews for rating calculations
- Admin users for CMS testing

### API Testing:
```bash
# Test product API
curl http://localhost:3000/api/products

# Test order creation
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_id": "...", "items": [...]}'
```

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check `DATABASE_URI` format
   - Verify Supabase project is active
   - Ensure IP whitelisting if required

2. **Payload CMS Not Loading**:
   - Verify `PAYLOAD_SECRET` is set and secure
   - Check `NEXT_PUBLIC_SERVER_URL` is correct
   - Ensure all required dependencies are installed

3. **Image Upload Issues**:
   - Check Supabase storage bucket permissions
   - Verify S3 credentials if using external storage
   - Ensure proper CORS configuration

4. **AI Features Not Working**:
   - Verify `NEXT_PUBLIC_GEMINI_API_KEY` is valid
   - Check API quotas and limits
   - Ensure vector extension is enabled in database

## 📞 Support

For additional help:
1. Check the logs in your terminal
2. Verify environment variables
3. Test database connectivity
4. Review Supabase dashboard for errors

---

## 🎯 Next Steps

After completing Phase 1 setup:

1. **Phase 2**: Frontend Development
   - Create shopping cart functionality
   - Build checkout flow
   - Implement order management

2. **Phase 3**: AI Integrations
   - Set up semantic search
   - Implement product recommendations
   - Add customer support chatbot

3. **Phase 4**: Advanced Features
   - Payment integration
   - Email notifications
   - Analytics dashboard