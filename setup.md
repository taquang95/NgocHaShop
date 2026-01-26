# Setup Instructions

## 1. Docker Compose
Create `docker-compose.yml` in the root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: curated_store
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

## 2. Database Schema (PostgreSQL)
Run this SQL script to initialize the database:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id)
);

CREATE TABLE retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    base_domain VARCHAR(255)
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id),
    retailer_id UUID REFERENCES retailers(id),
    image_url TEXT,
    price_regular NUMERIC(12, 2),
    price_deal NUMERIC(12, 2),
    affiliate_url TEXT NOT NULL,
    is_deal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    retailer_id UUID REFERENCES retailers(id),
    placement VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 3. Running Local
1. `npm install`
2. `npm start` (Runs the React App)
3. `docker-compose up -d` (Starts DB & Redis)