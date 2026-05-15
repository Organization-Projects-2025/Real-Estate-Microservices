class PropertyItem {
  final String title;
  final String location;
  final String type;
  final String listingType;
  final String image;
  final int price;
  final int beds;
  final int baths;
  final int sqft;
  final bool featured;

  const PropertyItem({
    required this.title,
    required this.location,
    required this.type,
    required this.listingType,
    required this.image,
    required this.price,
    required this.beds,
    required this.baths,
    required this.sqft,
    this.featured = false,
  });
}

class AgentItem {
  final String name;
  final String role;
  final double rating;
  final int deals;
  final String image;

  const AgentItem({
    required this.name,
    required this.role,
    required this.rating,
    required this.deals,
    required this.image,
  });
}

class ReviewItem {
  final String name;
  final int rating;
  final String text;
  final String date;

  const ReviewItem({
    required this.name,
    required this.rating,
    required this.text,
    required this.date,
  });
}

const List<PropertyItem> mockProperties = [
  PropertyItem(
    title: 'Modern Family Villa',
    location: 'Dubai Marina, UAE',
    type: 'Villa',
    listingType: 'buy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    price: 1250000,
    beds: 4,
    baths: 3,
    sqft: 3200,
    featured: true,
  ),
  PropertyItem(
    title: 'City View Apartment',
    location: 'Downtown, Dubai',
    type: 'Apartment',
    listingType: 'rent',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    price: 2800,
    beds: 2,
    baths: 2,
    sqft: 1100,
    featured: true,
  ),
  PropertyItem(
    title: 'Cozy Townhouse',
    location: 'Jumeirah, Dubai',
    type: 'Townhouse',
    listingType: 'buy',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
    price: 640000,
    beds: 3,
    baths: 2,
    sqft: 1900,
    featured: false,
  ),
  PropertyItem(
    title: 'Skyline Penthouse',
    location: 'Business Bay, Dubai',
    type: 'Penthouse',
    listingType: 'buy',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
    price: 2200000,
    beds: 5,
    baths: 4,
    sqft: 4800,
    featured: true,
  ),
  PropertyItem(
    title: 'Palm Beach Condo',
    location: 'Palm Jumeirah, Dubai',
    type: 'Condo',
    listingType: 'rent',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
    price: 5200,
    beds: 3,
    baths: 3,
    sqft: 2100,
    featured: false,
  ),
  PropertyItem(
    title: 'Green Garden House',
    location: 'Arabian Ranches, Dubai',
    type: 'House',
    listingType: 'buy',
    image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28',
    price: 890000,
    beds: 4,
    baths: 3,
    sqft: 2600,
    featured: false,
  ),
  PropertyItem(
    title: 'Studio Loft',
    location: 'Al Barsha, Dubai',
    type: 'Apartment',
    listingType: 'rent',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5',
    price: 1500,
    beds: 1,
    baths: 1,
    sqft: 620,
    featured: false,
  ),
  PropertyItem(
    title: 'Luxury Beach Villa',
    location: 'JBR, Dubai',
    type: 'Villa',
    listingType: 'buy',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    price: 3400000,
    beds: 6,
    baths: 5,
    sqft: 6200,
    featured: true,
  ),
];

const List<AgentItem> mockAgents = [
  AgentItem(
    name: 'Maya Hassan',
    role: 'Senior Agent',
    rating: 4.9,
    deals: 210,
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
  ),
  AgentItem(
    name: 'Omar Khalid',
    role: 'Leasing Agent',
    rating: 4.7,
    deals: 150,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  ),
  AgentItem(
    name: 'Sara Nabil',
    role: 'Luxury Specialist',
    rating: 4.8,
    deals: 180,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  ),
  AgentItem(
    name: 'Yousef Ali',
    role: 'Project Advisor',
    rating: 4.6,
    deals: 120,
    image: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0',
  ),
];

const List<ReviewItem> mockReviews = [
  ReviewItem(
    name: 'Lina M.',
    rating: 5,
    text: 'The process was smooth and transparent. Found a perfect home fast.',
    date: 'Apr 18, 2025',
  ),
  ReviewItem(
    name: 'David R.',
    rating: 4,
    text: 'Great agent support and detailed listings. Highly recommended.',
    date: 'Mar 02, 2025',
  ),
  ReviewItem(
    name: 'Aisha K.',
    rating: 5,
    text: 'Loved the tour experience and the follow-up. Very professional.',
    date: 'Feb 10, 2025',
  ),
];

const List<Map<String, String>> mockStats = [
  {'label': 'Properties Sold', 'value': '200+'},
  {'label': 'Happy Clients', 'value': '10K+'},
  {'label': 'Cities Covered', 'value': '15+'},
];
