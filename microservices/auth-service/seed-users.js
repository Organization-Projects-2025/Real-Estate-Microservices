/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  authType: { type: String, default: 'local' },
  profilePicture: { type: String, default: '' },
  role: { type: String, enum: ['user', 'agent', 'admin', 'developer'], default: 'user' },
  phoneNumber: String,
  whatsapp: String,
  contactEmail: String,
  active: { type: Boolean, default: true },
  savedProperties: { type: [String], default: [] },
  isEmailVerified: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// All users use the same password: Password123!
const COMMON_PASSWORD = 'Password123!';

const seedUsers = [
  // Admin User
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@realestate.com',
    role: 'admin',
    phoneNumber: '+971501234567',
    active: true,
  },
  
  // Developer Users
  {
    firstName: 'Developer',
    lastName: 'One',
    email: 'developer1@realestate.com',
    role: 'developer',
    phoneNumber: '+971502345678',
    active: true,
  },
  {
    firstName: 'Developer',
    lastName: 'Two',
    email: 'developer2@realestate.com',
    role: 'developer',
    phoneNumber: '+971503456789',
    active: true,
  },
  
  // Agent Users
  {
    firstName: 'Agent',
    lastName: 'One',
    email: 'agent1@realestate.com',
    role: 'agent',
    phoneNumber: '+971504567890',
    active: true,
  },
  {
    firstName: 'Agent',
    lastName: 'Two',
    email: 'agent2@realestate.com',
    role: 'agent',
    phoneNumber: '+971505678901',
    active: true,
  },
  {
    firstName: 'Agent',
    lastName: 'Three',
    email: 'agent3@realestate.com',
    role: 'agent',
    phoneNumber: '+971506789012',
    active: true,
  },
  {
    firstName: 'Agent',
    lastName: 'Four',
    email: 'agent4@realestate.com',
    role: 'agent',
    phoneNumber: '+971507890123',
    active: true,
  },
  {
    firstName: 'Agent',
    lastName: 'Five',
    email: 'agent5@realestate.com',
    role: 'agent',
    phoneNumber: '+971508901234',
    active: true,
  },
  
  // Regular Users (user1 through user12)
  {
    firstName: 'User',
    lastName: 'One',
    email: 'user1@realestate.com',
    role: 'user',
    phoneNumber: '+971501111111',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Two',
    email: 'user2@realestate.com',
    role: 'user',
    phoneNumber: '+971502222222',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Three',
    email: 'user3@realestate.com',
    role: 'user',
    phoneNumber: '+971503333333',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Four',
    email: 'user4@realestate.com',
    role: 'user',
    phoneNumber: '+971504444444',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Five',
    email: 'user5@realestate.com',
    role: 'user',
    phoneNumber: '+971505555555',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Six',
    email: 'user6@realestate.com',
    role: 'user',
    phoneNumber: '+971506666666',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Seven',
    email: 'user7@realestate.com',
    role: 'user',
    phoneNumber: '+971507777777',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Eight',
    email: 'user8@realestate.com',
    role: 'user',
    phoneNumber: '+971508888888',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Nine',
    email: 'user9@realestate.com',
    role: 'user',
    phoneNumber: '+971509999999',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Ten',
    email: 'user10@realestate.com',
    role: 'user',
    phoneNumber: '+971501010101',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Eleven',
    email: 'user11@realestate.com',
    role: 'user',
    phoneNumber: '+971501111112',
    active: true,
  },
  {
    firstName: 'User',
    lastName: 'Twelve',
    email: 'user12@realestate.com',
    role: 'user',
    phoneNumber: '+971501212121',
    active: true,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-auth';
    
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Hash the common password once
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(COMMON_PASSWORD, 12);
    console.log('✓ Password hashed');

    // Clear existing users (optional - comment out if you want to keep existing users)
    const deletedCount = await User.deleteMany({});
    console.log(`✓ Cleared ${deletedCount.deletedCount} existing users`);

    // Add hashed password to all users
    const usersWithPassword = seedUsers.map(user => ({
      ...user,
      password: hashedPassword,
      authType: 'local',
      profilePicture: '',
      savedProperties: [],
      isEmailVerified: true,
    }));

    // Insert users
    const result = await User.insertMany(usersWithPassword);
    console.log(`✓ Inserted ${result.length} users into database`);

    // List inserted users by role
    console.log('\n📋 Users by Role:');
    const roles = ['admin', 'developer', 'agent', 'user'];
    
    for (const role of roles) {
      const users = await User.find({ role }).sort({ email: 1 });
      console.log(`\n${role.toUpperCase()}S (${users.length}):`);
      users.forEach((user) => {
        console.log(`  • ${user.email} - ${user.firstName} ${user.lastName}`);
      });
    }

    console.log('\n🔑 All users have the same password: Password123!');
    console.log('\n✅ User seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
