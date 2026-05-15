-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  image TEXT,
  role TEXT,
  rating DECIMAL(3, 2),
  deals INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  type TEXT,
  listing_type TEXT CHECK (listing_type IN ('buy', 'rent', 'sell')),
  price DECIMAL(12, 2) NOT NULL,
  beds INTEGER,
  baths INTEGER,
  sqft INTEGER,
  image TEXT,
  images TEXT[],
  featured BOOLEAN DEFAULT false,
  agent_id UUID REFERENCES agents(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  date TEXT,
  agent_id UUID REFERENCES agents(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for properties table
CREATE POLICY "Anyone can read properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create properties" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own properties" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for agents table
CREATE POLICY "Anyone can read agents" ON agents
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create agents" ON agents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for reviews table
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
