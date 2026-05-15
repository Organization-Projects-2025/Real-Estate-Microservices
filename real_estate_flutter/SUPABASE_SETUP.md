# Supabase Setup for Real Estate Flutter App

## ✅ What's Already Done

1. ✅ Supabase dependency added to `pubspec.yaml`
2. ✅ Supabase initialized in `main.dart`
3. ✅ `supabase_service.dart` created with all methods

## 📋 Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to https://supabase.com/
2. Click **"Start your project"**
3. Sign up with email (no Google account needed!)
4. Verify your email

### Step 2: Create a New Project
1. Click **"New Project"**
2. Project name: `real-estate-flutter`
3. Database password: Create a strong password
4. Region: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for it to initialize

### Step 3: Get Your Credentials

**Method 1: From Project Home**
1. Click on your project name at the top
2. You'll see the **Project URL** displayed (looks like: `https://xxxxx.supabase.co`)

**Method 2: From Settings**
1. Click **Settings** (gear icon) on the left sidebar
2. Click **API** tab
3. Under "Project API Keys" section, you'll see:
   - **Project URL** at the top
   - **anon public key** below it

Copy both values.

### Step 4: Update `main.dart`

Replace the placeholder values:

```dart
await Supabase.initialize(
  url: 'https://xxxxx.supabase.co',  // Your Project URL
  anonKey: 'eyJhbGc...',  // Your anon public key
);
```

## 🗄️ Create Database Tables

Go to **SQL Editor** in Supabase and run these queries:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Properties Table
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  location TEXT,
  type TEXT CHECK (type IN ('buy', 'rent', 'sell')),
  images TEXT[],
  agent_id UUID REFERENCES agents(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Agents Table
```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  image TEXT,
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Set Row Level Security (RLS)

Go to **Authentication → Policies** and enable RLS for each table:

### Users Table Policy
```sql
-- Users can read/write their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Properties Table Policy
```sql
-- Anyone can read properties
CREATE POLICY "Anyone can read properties" ON properties
  FOR SELECT USING (true);

-- Authenticated users can create properties
CREATE POLICY "Authenticated users can create properties" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Agents Table Policy
```sql
-- Anyone can read agents
CREATE POLICY "Anyone can read agents" ON agents
  FOR SELECT USING (true);
```

### Reviews Table Policy
```sql
-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 🚀 Using Supabase in Your App

### Import the service:
```dart
import 'package:real_estate_flutter/services/supabase_service.dart';
```

### Sign Up:
```dart
final response = await SupabaseService.signUp(email, password);
if (response != null) {
  await SupabaseService.saveUser(response.user!.id, {
    'email': email,
    'first_name': firstName,
    'last_name': lastName,
  });
}
```

### Sign In:
```dart
final response = await SupabaseService.signIn(email, password);
if (response != null) {
  // Login successful
}
```

### Get Properties:
```dart
final properties = await SupabaseService.getProperties();
```

### Get Properties by Type:
```dart
final buyProperties = await SupabaseService.getPropertiesByType('buy');
final rentProperties = await SupabaseService.getPropertiesByType('rent');
```

### Watch Properties (Real-time):
```dart
SupabaseService.watchProperties().listen((properties) {
  // Update UI with real-time data
  setState(() {
    this.properties = properties;
  });
});
```

### Save Property:
```dart
await SupabaseService.saveProperty({
  'title': 'Beautiful House',
  'description': 'A lovely 3-bedroom house',
  'price': 500000,
  'location': 'Downtown',
  'type': 'buy',
  'agent_id': agentId,
});
```

### Get Agents:
```dart
final agents = await SupabaseService.getAgents();
```

### Get Reviews by Agent:
```dart
final reviews = await SupabaseService.getReviewsByAgent(agentId);
```

### Save Review:
```dart
await SupabaseService.saveReview({
  'agent_id': agentId,
  'user_id': userId,
  'rating': 5,
  'comment': 'Great agent!',
});
```

## 📝 Update Your Pages

### login_page.dart
```dart
import 'package:real_estate_flutter/services/supabase_service.dart';

Future<void> handleLogin() async {
  final response = await SupabaseService.signIn(
    emailc.text.trim(),
    passc.text,
  );
  
  if (response != null) {
    // Login successful
    Navigator.pop(context);
  } else {
    setState(() => error = 'Login failed');
  }
}
```

### signup_page.dart
```dart
Future<void> handleSignup() async {
  final response = await SupabaseService.signUp(email, password);
  
  if (response != null) {
    await SupabaseService.saveUser(response.user!.id, {
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
    });
    // Signup successful
  }
}
```

### buy_page.dart, rent_page.dart, etc.
```dart
@override
void initState() {
  super.initState();
  _loadProperties();
}

Future<void> _loadProperties() async {
  final properties = await SupabaseService.getPropertiesByType('buy');
  setState(() {
    this.properties = properties;
  });
}
```

## ✅ Test It

1. Run the app: `flutter run -d chrome`
2. Try signing up
3. Check Supabase Console → Table Editor to see your data
4. Try creating a property
5. Refresh and see it persist

## 📚 Available Methods in SupabaseService

```dart
// Auth
SupabaseService.signUp(email, password)
SupabaseService.signIn(email, password)
SupabaseService.signOut()
SupabaseService.getCurrentUser()
SupabaseService.authStateChanges()

// Users
SupabaseService.saveUser(uid, userData)
SupabaseService.getUser(uid)

// Properties
SupabaseService.saveProperty(propertyData)
SupabaseService.getProperties()
SupabaseService.getPropertiesByType(type)
SupabaseService.updateProperty(id, data)
SupabaseService.deleteProperty(id)
SupabaseService.watchProperties()

// Agents
SupabaseService.saveAgent(agentData)
SupabaseService.getAgents()
SupabaseService.watchAgents()

// Reviews
SupabaseService.saveReview(reviewData)
SupabaseService.getReviews()
SupabaseService.getReviewsByAgent(agentId)
SupabaseService.watchReviews()
```

## 🎉 You're Done!

Your Flutter app is now connected to Supabase. No Google account needed, completely free tier, and ready to scale!

## 🆘 Troubleshooting

**"Supabase not initialized"**
- Make sure you updated `main.dart` with your credentials

**"Permission denied" errors**
- Check your RLS policies in Supabase
- Make sure you're authenticated

**"Connection refused"**
- Check your Project URL is correct
- Make sure your anon key is correct

**Real-time not working**
- Make sure you're using `.stream()` or `.watch()` methods
- Check that Realtime is enabled in Supabase settings
