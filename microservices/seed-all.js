/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

function loadRootEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    process.env[key] = value;
  }
}

loadRootEnv();

const COMMON_PASSWORD = 'Password123!';
const AGENT_PASSWORD = 'Password123!';

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required in the root .env file`);
  }
  return value;
}

function maskedUri(uri) {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
}

function naturalPhotoSort(a, b) {
  const getNumber = (file) => Number((file.match(/\((\d+)\)/) || [])[1] || 0);
  return getNumber(a) - getNumber(b);
}

function loadImages() {
  const imagesDir = path.resolve(__dirname, '../public/images');
  const files = fs
    .readdirSync(imagesDir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort(naturalPhotoSort);

  if (files.length === 0) {
    throw new Error(`No image files found in ${imagesDir}`);
  }

  return files.map((file) => {
    const ext = path.extname(file).toLowerCase().replace('.', '');
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    const buffer = fs.readFileSync(path.join(imagesDir, file));
    return {
      file,
      dataUrl: `data:image/${mime};base64,${buffer.toString('base64')}`,
    };
  });
}

const userSchema = new mongoose.Schema(
  {
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
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    isEmailVerified: { type: Boolean, default: true },
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
  },
  { timestamps: true, collection: 'users' }
);

const agentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactEmail: String,
    phoneNumber: { type: String, required: true },
    totalSales: { type: Number, default: 0 },
    yearsOfExperience: { type: Number, required: true },
    age: { type: Number, required: true },
    about: String,
    user: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true, collection: 'agents' }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    listingType: { type: String, enum: ['sale', 'rent'], required: true },
    propertyType: { type: String, enum: ['residential', 'commercial'], required: true },
    subType: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    area: {
      sqft: { type: Number, required: true },
      sqm: { type: Number, required: true },
    },
    price: { type: Number, required: true },
    media: { type: [String], required: true },
    buildDate: Date,
    user: { type: String, required: true },
    status: { type: String, enum: ['active', 'sold'], required: true },
    features: {
      bedrooms: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
      garage: { type: Number, required: true },
      pool: { type: Boolean, required: true },
      yard: { type: Boolean, required: true },
      pets: { type: Boolean, required: true },
      furnished: { type: String, enum: ['fully', 'partly', 'none'], required: true },
      airConditioning: { type: Boolean, required: true },
      internet: { type: Boolean, required: true },
      electricity: { type: Boolean, required: true },
      water: { type: Boolean, required: true },
      gas: { type: Boolean, required: true },
      wifi: { type: Boolean, required: true },
      security: { type: Boolean, required: true },
    },
  },
  { timestamps: true, collection: 'properties' }
);

const reviewSchema = new mongoose.Schema(
  {
    agent: { type: mongoose.Schema.Types.ObjectId, required: true },
    reviewerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: String,
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'hidden'], default: 'active' },
  },
  { timestamps: true, collection: 'reviews' }
);

const developerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    contact: {
      email: String,
      phone: String,
      website: String,
    },
  },
  { timestamps: true, collection: 'developers' }
);

const projectSchema = new mongoose.Schema(
  {
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    location: String,
    images: [String],
    status: { type: String, default: 'active' },
    startDate: Date,
    expectedCompletionDate: Date,
  },
  { timestamps: true, collection: 'projects' }
);

const developerPropertySchema = new mongoose.Schema(
  {
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    listingType: { type: String, enum: ['sale', 'rent'], required: true },
    propertyType: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    area: {
      sqft: Number,
      sqm: Number,
    },
    features: {
      bedrooms: Number,
      bathrooms: Number,
      garage: Number,
      pool: Boolean,
      yard: Boolean,
      pets: Boolean,
      furnished: String,
    },
    images: [String],
    status: { type: String, default: 'active' },
  },
  { timestamps: true, collection: 'developerproperties' }
);

const filterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'filters' }
);

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['success', 'info', 'warning', 'error'], default: 'info' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'notifications' }
);

const User = mongoose.model('User', userSchema);
const Agent = mongoose.model('Agent', agentSchema);
const Property = mongoose.model('Property', propertySchema);
const Review = mongoose.model('Review', reviewSchema);
const Developer = mongoose.model('Developer', developerSchema);
const Project = mongoose.model('Project', projectSchema);
const DeveloperProperty = mongoose.model('DeveloperProperty', developerPropertySchema);
const Filter = mongoose.model('Filter', filterSchema);
const Notification = mongoose.model('Notification', notificationSchema);

function propertySeed(image, userId, index, override = {}) {
  const cities = [
    ['New Cairo', 'Cairo Governorate', 'North 90 Street'],
    ['Sheikh Zayed', 'Giza Governorate', 'Beverly Hills Road'],
    ['Maadi', 'Cairo Governorate', 'Road 9'],
    ['Zamalek', 'Cairo Governorate', 'Abu El Feda Street'],
    ['Alexandria', 'Alexandria Governorate', 'Corniche Road'],
    ['New Administrative Capital', 'Cairo Governorate', 'R7 District'],
    ['6th of October', 'Giza Governorate', 'Palm Hills Avenue'],
    ['Heliopolis', 'Cairo Governorate', 'El Merghany Street'],
    ['Mansoura', 'Dakahlia Governorate', 'El Gomhoria Street'],
    ['North Coast', 'Matrouh Governorate', 'Sidi Abdelrahman Bay'],
  ];
  const [city, state, street] = cities[index % cities.length];
  const sale = index % 2 === 0;
  const residential = index % 3 !== 0;

  return {
    title: `${city} ${residential ? 'Residence' : 'Business Hub'} ${index + 1}`,
    description:
      `A polished Egypt-focused ${sale ? 'sale' : 'rent'} listing in ${city}, close to daily services, main roads, and modern community facilities.`,
    listingType: sale ? 'sale' : 'rent',
    propertyType: residential ? 'residential' : 'commercial',
    subType: residential ? (index % 2 === 0 ? 'Apartment' : 'Villa') : 'Office',
    address: {
      street,
      city,
      state,
      country: 'Egypt',
    },
    area: {
      sqft: 1250 + index * 145,
      sqm: 116 + index * 13,
    },
    price: sale ? 3200000 + index * 425000 : 18000 + index * 3500,
    media: [image.dataUrl],
    buildDate: new Date(2018 + (index % 7), index % 12, 10),
    user: String(userId),
    status: index === 8 ? 'sold' : 'active',
    features: {
      bedrooms: residential ? 2 + (index % 4) : 0,
      bathrooms: residential ? 2 + (index % 3) : 1 + (index % 2),
      garage: index % 3,
      pool: index % 2 === 0,
      yard: index % 4 === 1,
      pets: residential && index % 3 !== 0,
      furnished: ['fully', 'partly', 'none'][index % 3],
      airConditioning: true,
      internet: true,
      electricity: true,
      water: true,
      gas: residential,
      wifi: true,
      security: true,
    },
    ...override,
  };
}

function devPropertySeed(image, developerId, projectId, index, title, location) {
  const city = location.split(',')[0];
  return {
    developerId,
    projectId,
    title,
    description:
      `Primary unit in ${location}, designed for the Egyptian market with efficient layouts, secure access, and strong investment appeal.`,
    price: 4100000 + index * 680000,
    listingType: index % 2 === 0 ? 'sale' : 'rent',
    propertyType: index % 3 === 0 ? 'Commercial' : 'Residential',
    address: {
      street: `Phase ${index + 1}, Building ${String.fromCharCode(65 + index)}`,
      city,
      state: location.includes('Giza') ? 'Giza Governorate' : 'Cairo Governorate',
      country: 'Egypt',
      zipCode: `11${index}45`,
    },
    area: {
      sqft: 1450 + index * 210,
      sqm: 135 + index * 19,
    },
    features: {
      bedrooms: index % 3 === 0 ? 0 : 2 + (index % 3),
      bathrooms: 2 + (index % 2),
      garage: 1 + (index % 2),
      pool: index % 2 === 0,
      yard: index % 2 === 1,
      pets: true,
      furnished: ['fully', 'partly', 'none'][index % 3],
    },
    images: [image.dataUrl],
    status: 'active',
  };
}

async function seed() {
  const mongoUri = requiredEnv('MONGODB_URI');
  const images = loadImages();
  console.log(`Connecting to ${maskedUri(mongoUri)}`);
  await mongoose.connect(mongoUri);

  console.log('Resetting seeded collections...');
  await Promise.all([
    User.deleteMany({}),
    Agent.deleteMany({}),
    Property.deleteMany({}),
    Review.deleteMany({}),
    Developer.deleteMany({}),
    Project.deleteMany({}),
    DeveloperProperty.deleteMany({}),
    Filter.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const userPassword = await bcrypt.hash(COMMON_PASSWORD, 12);
  const agentPassword = await bcrypt.hash(AGENT_PASSWORD, 12);

  const baseUsers = [
    ['Admin', 'User', 'admin@realestate.com', 'admin', '+201000000001'],
    ['Nour', 'Hassan', 'developer1@realestate.com', 'developer', '+201000000101'],
    ['Karim', 'Mansour', 'developer2@realestate.com', 'developer', '+201000000102'],
    ['Mariam', 'Fouad', 'agent1@realestate.com', 'agent', '+201000000201'],
    ['Omar', 'Samir', 'agent2@realestate.com', 'agent', '+201000000202'],
    ['Youssef', 'Adel', 'agent3@realestate.com', 'agent', '+201000000203'],
    ['Laila', 'Nabil', 'agent4@realestate.com', 'agent', '+201000000204'],
    ['Hana', 'Tarek', 'agent5@realestate.com', 'agent', '+201000000205'],
    ['Ahmed', 'Ali', 'user1@realestate.com', 'user', '+201000000301'],
    ['Salma', 'Ibrahim', 'user2@realestate.com', 'user', '+201000000302'],
    ['Mostafa', 'Khaled', 'user3@realestate.com', 'user', '+201000000303'],
    ['Dina', 'Mahmoud', 'user4@realestate.com', 'user', '+201000000304'],
    ['Hussein', 'Farouk', 'user5@realestate.com', 'user', '+201000000305'],
    ['Farida', 'Sherif', 'user6@realestate.com', 'user', '+201000000306'],
    ['Malak', 'Ramy', 'user7@realestate.com', 'user', '+201000000307'],
    ['Tamer', 'Fathy', 'user8@realestate.com', 'user', '+201000000308'],
    ['Nada', 'Gamal', 'user9@realestate.com', 'user', '+201000000309'],
    ['Seif', 'Ashraf', 'user10@realestate.com', 'user', '+201000000310'],
    ['Jana', 'Wael', 'user11@realestate.com', 'user', '+201000000311'],
    ['Basel', 'Yehia', 'user12@realestate.com', 'user', '+201000000312'],
  ];

  const users = await User.insertMany(
    baseUsers.map(([firstName, lastName, email, role, phoneNumber], index) => ({
      firstName,
      lastName,
      email,
      password: userPassword,
      authType: 'local',
      profilePicture: images[index % images.length].dataUrl,
      role,
      phoneNumber,
      whatsapp: phoneNumber,
      contactEmail: email,
      active: true,
      savedProperties: [],
      isEmailVerified: true,
    }))
  );

  const byEmail = new Map(users.map((user) => [user.email, user]));
  const agents = await Agent.insertMany(
    [
      ['Mariam', 'Fouad', 'agent1@realestate.com', 74, 9, 33, 'New Cairo and New Capital specialist.'],
      ['Omar', 'Samir', 'agent2@realestate.com', 58, 7, 35, 'Sheikh Zayed and 6th of October advisor.'],
      ['Youssef', 'Adel', 'agent3@realestate.com', 91, 11, 39, 'Commercial property and office leasing expert.'],
      ['Laila', 'Nabil', 'agent4@realestate.com', 42, 6, 31, 'Maadi, Zamalek, and Nile-view homes consultant.'],
      ['Hana', 'Tarek', 'agent5@realestate.com', 67, 8, 34, 'Alexandria and North Coast residential specialist.'],
    ].map(([firstName, lastName, email, totalSales, yearsOfExperience, age, about]) => ({
      firstName,
      lastName,
      email,
      password: agentPassword,
      contactEmail: email,
      phoneNumber: byEmail.get(email).phoneNumber,
      totalSales,
      yearsOfExperience,
      age,
      about,
      user: String(byEmail.get(email)._id),
      status: 'active',
    }))
  );

  const filters = await Filter.insertMany([
    ['Residential', 'property-type', 'Homes and residential units', 1],
    ['Commercial', 'property-type', 'Offices, clinics, and retail spaces', 2],
    ['Apartment', 'sub-type', 'Apartment units', 1],
    ['Villa', 'sub-type', 'Standalone and twin villas', 2],
    ['Office', 'sub-type', 'Administrative offices', 3],
    ['Pool', 'amenities', 'Swimming pool access', 1],
    ['Gym', 'amenities', 'Fitness center access', 2],
    ['Security', 'amenities', 'Gated security and access control', 3],
    ['Parking', 'amenities', 'Dedicated parking', 4],
    ['Garden', 'amenities', 'Private or shared green space', 5],
    ['Air Conditioning', 'features', 'Installed air conditioning', 1],
    ['Internet', 'features', 'Internet ready', 2],
    ['Gas', 'features', 'Natural gas connection', 3],
    ['Furnished', 'features', 'Furnished option', 4],
  ].map(([name, category, description, order]) => ({ name, category, description, order, isActive: true })));

  const standardProperties = await Property.insertMany(
    images.slice(0, 10).map((image, index) => {
      const owner = users[8 + (index % 12)];
      return propertySeed(image, owner._id, index);
    })
  );

  const developers = await Developer.insertMany([
    {
      name: 'Nile Crown Developments',
      description: 'Egyptian developer focused on mixed-use communities in East Cairo.',
      contact: { email: 'hello@nilecrown.example', phone: '+20224000001', website: 'https://nilecrown.example' },
    },
    {
      name: 'Delta Heights Real Estate',
      description: 'Residential and coastal communities across Giza, Alexandria, and the North Coast.',
      contact: { email: 'sales@deltaheights.example', phone: '+20224000002', website: 'https://deltaheights.example' },
    },
  ]);

  const developerUsers = [byEmail.get('developer1@realestate.com'), byEmail.get('developer2@realestate.com')];
  const projects = await Project.insertMany([
    {
      developerId: developerUsers[0]._id,
      name: 'Cairo Gate Residences',
      description: 'A gated residential phase with parks, retail walkways, and smart home-ready apartments.',
      location: 'New Cairo, Cairo Governorate',
      images: [images[10].dataUrl],
      status: 'active',
      startDate: new Date('2024-03-01'),
      expectedCompletionDate: new Date('2027-06-30'),
    },
    {
      developerId: developerUsers[0]._id,
      name: 'Capital Walk Offices',
      description: 'Administrative offices close to government district routes in the New Administrative Capital.',
      location: 'New Administrative Capital, Cairo Governorate',
      images: [images[11].dataUrl],
      status: 'active',
      startDate: new Date('2023-09-15'),
      expectedCompletionDate: new Date('2026-12-31'),
    },
    {
      developerId: developerUsers[0]._id,
      name: 'Maadi Riverside',
      description: 'Boutique apartments with green courtyards and fast access to Corniche routes.',
      location: 'Maadi, Cairo Governorate',
      images: [images[12].dataUrl],
      status: 'active',
      startDate: new Date('2025-01-10'),
      expectedCompletionDate: new Date('2028-03-31'),
    },
    {
      developerId: developerUsers[1]._id,
      name: 'Zayed Palm District',
      description: 'Family villas and duplexes near schools, clubs, and mall corridors in West Cairo.',
      location: 'Sheikh Zayed, Giza Governorate',
      images: [images[13].dataUrl],
      status: 'active',
      startDate: new Date('2024-05-20'),
      expectedCompletionDate: new Date('2027-10-31'),
    },
    {
      developerId: developerUsers[1]._id,
      name: 'Alexandria Bay Homes',
      description: 'Mediterranean-inspired homes with serviced facilities near Alexandria Corniche.',
      location: 'Alexandria, Alexandria Governorate',
      images: [images[14].dataUrl],
      status: 'active',
      startDate: new Date('2023-11-01'),
      expectedCompletionDate: new Date('2026-08-31'),
    },
  ]);

  const developerProperties = await DeveloperProperty.insertMany([
    devPropertySeed(images[15], projects[0].developerId, projects[0]._id, 0, 'Cairo Gate Three-Bedroom Apartment', projects[0].location),
    devPropertySeed(images[16], projects[1].developerId, projects[1]._id, 1, 'Capital Walk Finished Office', projects[1].location),
    devPropertySeed(images[17], projects[2].developerId, projects[2]._id, 2, 'Maadi Riverside Garden Duplex', projects[2].location),
    devPropertySeed(images[18], projects[3].developerId, projects[3]._id, 3, 'Zayed Palm Standalone Villa', projects[3].location),
    devPropertySeed(images[19], projects[4].developerId, projects[4]._id, 4, 'Alexandria Bay Sea-View Apartment', projects[4].location),
  ]);

  const reviewNames = ['Ahmed Ali', 'Salma Ibrahim', 'Mostafa Khaled', 'Dina Mahmoud', 'Hussein Farouk'];
  const reviewText = [
    'Clear communication and strong knowledge of New Cairo pricing.',
    'Helped us compare Sheikh Zayed options with honest advice.',
    'Very organized viewing schedule and professional follow-up.',
    'Understood our Maadi requirements quickly and negotiated well.',
    'Excellent coastal property guidance and fast responses.',
  ];
  const reviews = await Review.insertMany(
    agents.flatMap((agent, agentIndex) =>
      [0, 1].map((offset) => ({
        agent: agent._id,
        reviewerName: reviewNames[(agentIndex + offset) % reviewNames.length],
        rating: 4 + ((agentIndex + offset) % 2),
        reviewText: reviewText[(agentIndex + offset) % reviewText.length],
        date: new Date(2026, agentIndex, 10 + offset),
        status: 'active',
      }))
    )
  );

  const notifications = await Notification.insertMany([
    {
      user: byEmail.get('admin@realestate.com')._id,
      title: 'Seed Data Loaded',
      message: 'Comprehensive Egypt demo dataset has been loaded successfully.',
      type: 'success',
      read: false,
    },
    {
      user: byEmail.get('developer1@realestate.com')._id,
      title: 'Project Approved',
      message: 'Cairo Gate Residences is now visible to public users.',
      type: 'info',
      read: false,
    },
    {
      user: byEmail.get('agent1@realestate.com')._id,
      title: 'New Review',
      message: 'A customer posted a new five-star review on your profile.',
      type: 'success',
      read: false,
    },
  ]);

  await User.updateOne(
    { email: 'user1@realestate.com' },
    { savedProperties: standardProperties.slice(0, 3).map((property) => String(property._id)) }
  );
  await User.updateOne(
    { email: 'user2@realestate.com' },
    { savedProperties: standardProperties.slice(3, 6).map((property) => String(property._id)) }
  );

  console.log('\nSeed complete:');
  console.log(`  Users: ${users.length}`);
  console.log(`  Agents: ${agents.length}`);
  console.log(`  Filters: ${filters.length}`);
  console.log(`  Standard properties: ${standardProperties.length}`);
  console.log(`  Developers: ${developers.length}`);
  console.log(`  Projects: ${projects.length}`);
  console.log(`  Developer properties: ${developerProperties.length}`);
  console.log(`  Reviews: ${reviews.length}`);
  console.log(`  Notifications: ${notifications.length}`);
  console.log(`  Embedded image files used: ${images.length}`);
  console.log(`\nLogin password for seeded users: ${COMMON_PASSWORD}`);
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
