-- Elecro.Mart E-commerce Database Setup Script
-- This script sets up the PostgreSQL database with required extensions and schemas

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI-powered product recommendations

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', r.table_name, r.table_name);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at 
                       BEFORE UPDATE ON %s 
                       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', r.table_name, r.table_name);
    END LOOP;
END $$;

-- Create function to update product ratings when reviews change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC;
    review_count INTEGER;
BEGIN
    -- Calculate average rating for the product
    SELECT 
        ROUND(AVG(CAST(rating AS NUMERIC)), 1),
        COUNT(*)
    INTO avg_rating, review_count
    FROM reviews 
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) 
    AND is_approved = true;
    
    -- Update product rating and review count
    UPDATE products 
    SET 
        rating = COALESCE(avg_rating, 0),
        review_count = COALESCE(review_count, 0)
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger for automatic rating updates
CREATE TRIGGER update_product_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

-- Create function to update order totals when order items change
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
DECLARE
    new_subtotal NUMERIC := 0;
    new_tax_amount NUMERIC := 0;
    new_total_amount NUMERIC := 0;
    order_id_param UUID;
BEGIN
    -- Determine which order ID to use
    order_id_param := COALESCE(NEW.order_id, OLD.order_id);
    
    -- Calculate new totals
    SELECT 
        COALESCE(SUM(final_price), 0),
        COALESCE(SUM(tax_amount), 0)
    INTO new_subtotal, new_tax_amount
    FROM order_items 
    WHERE order_id = order_id_param;
    
    new_total_amount := new_subtotal + new_tax_amount;
    
    -- Update order
    UPDATE orders 
    SET 
        subtotal = new_subtotal,
        tax_amount = new_tax_amount,
        total_amount = new_total_amount
    WHERE id = order_id_param;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger for automatic order total updates
CREATE TRIGGER update_order_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_totals();

-- Create function to update category product counts
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
DECLARE
    category_id_param UUID;
BEGIN
    -- Determine which category to update
    category_id_param := COALESCE(NEW.category_id, OLD.category_id);
    
    -- Update product count for the category
    UPDATE categories 
    SET product_count = (
        SELECT COUNT(*) 
        FROM products 
        WHERE category_id = category_id_param 
        AND is_active = true
    )
    WHERE id = category_id_param;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger for automatic category product count updates
CREATE TRIGGER update_category_product_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_category_product_count();

-- Create function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(table_name TEXT, base_slug TEXT, exclude_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    final_slug TEXT := base_slug;
    counter INTEGER := 1;
    slug_exists BOOLEAN;
BEGIN
    LOOP
        -- Check if slug exists (excluding current record if provided)
        EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE slug = $1 %s)', 
                      table_name, 
                      CASE WHEN exclude_id IS NOT NULL THEN 'AND id != $2' ELSE '' END)
        INTO slug_exists
        USING final_slug, exclude_id;
        
        IF NOT slug_exists THEN
            RETURN final_slug;
        END IF;
        
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate SKU for products
CREATE OR REPLACE FUNCTION generate_product_sku()
RETURNS TEXT AS $$
DECLARE
    sku_base TEXT := 'PRD';
    timestamp_part TEXT := to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS');
    random_part TEXT := upper(substring(md5(random()::text), 1, 5));
BEGIN
    RETURN sku_base || '-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_base TEXT := 'ORD';
    timestamp_part TEXT := to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS');
    random_part TEXT := upper(substring(md5(random()::text), 1, 6));
BEGIN
    RETURN order_base || '-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate customer IDs
CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS TEXT AS $$
DECLARE
    customer_base TEXT := 'CUST';
    timestamp_part TEXT := to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS');
    random_part TEXT := upper(substring(md5(random()::text), 1, 6));
BEGIN
    RETURN customer_base || '-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate review IDs
CREATE OR REPLACE FUNCTION generate_review_id()
RETURNS TEXT AS $$
DECLARE
    review_base TEXT := 'REV';
    timestamp_part TEXT := to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS');
    random_part TEXT := upper(substring(md5(random()::text), 1, 6));
BEGIN
    RETURN review_base || '-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for public read access
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on approved reviews" ON reviews FOR SELECT USING (is_approved = true);

-- Create RLS policies for authenticated users
CREATE POLICY "Users can read their own orders" ON orders FOR SELECT USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
));

CREATE POLICY "Users can read their own order items" ON order_items FOR SELECT USING (order_id IN (
    SELECT id FROM orders WHERE customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
    )
));

CREATE POLICY "Users can read their own customer profile" ON customers FOR SELECT USING (user_id = auth.uid());

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin or manager
CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'manager')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin/manager policies
CREATE POLICY "Admins and managers can manage products" ON products FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins and managers can manage categories" ON categories FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins and managers can manage orders" ON orders FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins and managers can manage order items" ON order_items FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins and managers can manage customers" ON customers FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins and managers can manage reviews" ON reviews FOR ALL USING (is_admin_or_manager());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- AI Enhancement: Create product embeddings for semantic search
CREATE TABLE IF NOT EXISTS product_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    embedding vector(768), -- Gemini embeddings dimension
    content_type TEXT NOT NULL DEFAULT 'combined', -- 'name', 'description', 'combined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, content_type)
);

-- Create vector similarity search function
CREATE OR REPLACE FUNCTION search_products_semantic(
    query_embedding vector(768),
    match_threshold float DEFAULT 0.1,
    max_results int DEFAULT 50
)
RETURNS TABLE (
    product_id uuid,
    similarity float,
    product_name text,
    product_description text,
    category_name text,
    price numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id as product_id,
        1 - (pe.embedding <=> query_embedding) as similarity,
        p.name as product_name,
        p.description as product_description,
        c.name as category_name,
        p.price
    FROM product_embeddings pe
    JOIN products p ON pe.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    WHERE pe.content_type = 'combined'
      AND p.is_active = true
      AND 1 - (pe.embedding <=> query_embedding) > match_threshold
    ORDER BY pe.embedding <=> query_embedding
    LIMIT max_results;
END;
$$;

-- Create function to get product recommendations based on embeddings
CREATE OR REPLACE FUNCTION get_product_recommendations(
    base_product_id uuid,
    max_results int DEFAULT 10,
    similarity_threshold float DEFAULT 0.5
)
RETURNS TABLE (
    product_id uuid,
    product_name text,
    product_description text,
    category_name text,
    price numeric,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        c.name as category_name,
        p.price,
        1 - (pe.embedding <=> base_embedding.embedding) as similarity
    FROM (
        SELECT embedding
        FROM product_embeddings
        WHERE product_id = base_product_id
          AND content_type = 'combined'
        LIMIT 1
    ) AS base_embedding,
    product_embeddings pe
    JOIN products p ON pe.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    WHERE pe.product_id != base_product_id
      AND pe.content_type = 'combined'
      AND p.is_active = true
      AND 1 - (pe.embedding <=> base_embedding.embedding) > similarity_threshold
    ORDER BY pe.embedding <=> base_embedding.embedding
    LIMIT max_results;
END;
$$;

-- Add indexes for embeddings
CREATE INDEX IF NOT EXISTS idx_product_embeddings_product_id ON product_embeddings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_embeddings_content_type ON product_embeddings(content_type);

-- Create vector extension indexes (note: this requires pgvector specific indexing)
-- These indexes improve similarity search performance significantly

-- Grant specific permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON customers TO authenticated;
GRANT SELECT ON products, categories, reviews TO authenticated;
GRANT SELECT ON product_embeddings TO authenticated;

-- Grant full permissions to service role (for Payload CMS)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT SELECT ON product_embeddings TO service_role;

-- Create useful views for frontend queries
CREATE VIEW featured_products AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_featured = true 
AND p.is_active = true
ORDER BY p.created_at DESC;

CREATE VIEW product_reviews_summary AS
SELECT 
    p.id as product_id,
    COUNT(r.id) as review_count,
    AVG(CAST(r.rating AS NUMERIC)) as average_rating,
    COUNT(CASE WHEN r.is_verified = true THEN 1 END) as verified_review_count
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
GROUP BY p.id;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Extensions enabled: uuid-ossp, pgcrypto, vector';
    RAISE NOTICE 'Tables created with RLS policies and triggers';
    RAISE NOTICE 'Functions and views created for e-commerce functionality';
END $$;
