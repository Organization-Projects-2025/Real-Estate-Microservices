import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../widgets/property_thumbnail.dart';

class HomepagePage extends StatefulWidget {
  final VoidCallback? onAuthChanged;
  const HomepagePage({super.key, this.onAuthChanged});

  @override
  State<HomepagePage> createState() => _HomepagePageState();
}

class _HomepagePageState extends State<HomepagePage> {
  static const Color kPurple = Color(0xFF703BF7);
  static const Color kBg = Color(0xFF121212);
  static const Color kCard = Color(0xFF1A1A1A);

  final TextEditingController searchc = TextEditingController();
  List<dynamic> properties = [];
  List<dynamic> reviews = [];
  bool loading = true;

  static const List<Map<String, String>> features = [
    {
      'title': 'Find Your Dream Property',
      'desc': 'Search properties with ease.',
    },
    {'title': 'Connect with Agents', 'desc': 'Get expert advice instantly.'},
    {'title': 'Smart Financials', 'desc': 'Explore loan options.'},
  ];

  static const List<Map<String, String>> stats = [
    {'label': 'Properties Sold', 'value': '200+'},
    {'label': 'Happy Clients', 'value': '10K+'},
    {'label': 'Cities Covered', 'value': '15+'},
  ];

  static const List<Map<String, String>> faqs = [
    {
      'q': 'How do I search for properties?',
      'a': 'Use the search bar to enter your preferred location.',
    },
    {
      'q': 'What documents do I need to sell?',
      'a': 'You\'ll need property deeds and identification.',
    },
    {
      'q': 'How can I contact an agent?',
      'a': 'Use the "Find an Agent" feature.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final props = await ApiService.getProperties();
      final revs = await ApiService.getReviews();
      if (mounted) {
        setState(() {
          properties = props.take(4).toList();
          reviews = revs.take(3).toList();
          loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  void dispose() {
    searchc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: RefreshIndicator(
        onRefresh: _loadData,
        color: kPurple,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Hero ──────────────────────────────────────────────────────
              Stack(
                children: [
                  SizedBox(
                    height: 320,
                    width: double.infinity,
                    child: Image.network(
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          Container(height: 320, color: kCard),
                    ),
                  ),
                  Container(
                    height: 320,
                    color: Colors.black.withValues(alpha: 0.55),
                  ),
                  Positioned(
                    left: 24,
                    right: 24,
                    top: 48,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        RichText(
                          text: const TextSpan(
                            style: TextStyle(
                              fontSize: 34,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              height: 1.2,
                            ),
                            children: [
                              TextSpan(text: 'Agents.\nTours.\nLoans.\n'),
                              TextSpan(
                                text: 'Homes.',
                                style: TextStyle(color: kPurple),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Enter your preferred area and discover your dream property today.',
                          style: TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        const SizedBox(height: 14),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: searchc,
                                style: const TextStyle(color: Colors.black87),
                                decoration: InputDecoration(
                                  hintText: 'City, neighborhood, ZIP…',
                                  hintStyle: const TextStyle(
                                    color: Colors.black45,
                                  ),
                                  filled: true,
                                  fillColor: Colors.white,
                                  prefixIcon: const Icon(
                                    Icons.search,
                                    color: Colors.black45,
                                  ),
                                  border: const OutlineInputBorder(
                                    borderRadius: BorderRadius.horizontal(
                                      left: Radius.circular(30),
                                    ),
                                    borderSide: BorderSide.none,
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
                                ),
                              ),
                            ),
                            Container(
                              height: 50,
                              decoration: const BoxDecoration(
                                color: kPurple,
                                borderRadius: BorderRadius.horizontal(
                                  right: Radius.circular(30),
                                ),
                              ),
                              child: TextButton(
                                onPressed: () {},
                                child: const Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 12),
                                  child: Text(
                                    'Search',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // ── Stats ─────────────────────────────────────────────────────
              Container(
                color: kCard,
                padding: const EdgeInsets.symmetric(
                  vertical: 20,
                  horizontal: 16,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: stats
                      .map(
                        (s) => Column(
                          children: [
                            Text(
                              s['value']!,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: kPurple,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              s['label']!,
                              style: const TextStyle(
                                color: Colors.white60,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      )
                      .toList(),
                ),
              ),

              // ── Why Choose Tamalak ────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
                child: Column(
                  children: [
                    const Text(
                      'Why Choose Tamalak?',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ...features.map(
                      (f) => Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: kCard,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.white10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              f['title']!,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              f['desc']!,
                              style: const TextStyle(color: Colors.white60),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // ── Featured Properties ───────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Featured Properties',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 14),
                    if (loading)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.all(24),
                          child: CircularProgressIndicator(color: kPurple),
                        ),
                      )
                    else if (properties.isEmpty)
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: kCard,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Text(
                          'No properties found. Make sure the backend is running.',
                          style: TextStyle(color: Colors.white54),
                          textAlign: TextAlign.center,
                        ),
                      )
                    else
                      ...properties.map((p) => _PropertyCard(property: p)),
                  ],
                ),
              ),

              // ── Reviews ───────────────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ShaderMask(
                      shaderCallback: (b) => const LinearGradient(
                        colors: [kPurple, Colors.white],
                      ).createShader(b),
                      child: const Text(
                        'What Our Clients Say',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    if (reviews.isEmpty && !loading)
                      const Text(
                        'No reviews yet.',
                        style: TextStyle(color: Colors.white54),
                      )
                    else
                      ...reviews.map((r) => _ReviewCard(review: r)),
                  ],
                ),
              ),

              // ── FAQs ──────────────────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Frequently Asked Questions',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 14),
                    ...faqs.map(
                      (faq) => Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: kCard,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.white10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              faq['q']!,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              faq['a']!,
                              style: const TextStyle(color: Colors.white60),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // ── Footer ────────────────────────────────────────────────────
              Container(
                color: kCard,
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: const Text(
                  '© 2025 Tamalak. All Rights Reserved.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white38, fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Property card ─────────────────────────────────────────────────────────────
class _PropertyCard extends StatelessWidget {
  final dynamic property;
  const _PropertyCard({required this.property});

  static const Color kPurple = Color(0xFF703BF7);
  static const Color kCard = Color(0xFF1A1A1A);

  @override
  Widget build(BuildContext context) {
    final media = (property['media'] as List?)?.cast<String>() ?? [];
    final image =
        (property['thumbnailPath'] ?? (media.isNotEmpty ? media[0] : ''))
            .toString();
    final address = property['address'] as Map? ?? {};
    final features = property['features'] as Map? ?? {};
    final area = property['area'] as Map? ?? {};
    final price = property['price'] ?? 0;
    final listingType = property['listingType'] ?? 'sale';
    final priceLabel = listingType == 'rent'
        ? '\$${price.toString()} /mo'
        : '\$${price.toString()}';

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: PropertyThumbnail(
              path: image,
              height: 180,
              borderRadius: BorderRadius.zero,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  property['title'] ?? 'Property',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${address['city'] ?? ''}, ${address['state'] ?? ''}',
                  style: const TextStyle(color: Colors.white54, fontSize: 13),
                ),
                const SizedBox(height: 6),
                Text(
                  priceLabel,
                  style: const TextStyle(
                    color: kPurple,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _chip('${features['bedrooms'] ?? 0} Beds'),
                    const SizedBox(width: 8),
                    _chip('${features['bathrooms'] ?? 0} Baths'),
                    const SizedBox(width: 8),
                    _chip('${area['sqft'] ?? 0} sqft'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _chip(String text) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    decoration: BoxDecoration(
      color: Colors.white10,
      borderRadius: BorderRadius.circular(8),
    ),
    child: Text(
      text,
      style: const TextStyle(color: Colors.white60, fontSize: 11),
    ),
  );
}

// ── Review card ───────────────────────────────────────────────────────────────
class _ReviewCard extends StatelessWidget {
  final dynamic review;
  const _ReviewCard({required this.review});

  @override
  Widget build(BuildContext context) {
    final rating = (review['rating'] as num?)?.toInt() ?? 0;
    final agent = review['agent'] as Map?;
    final agentName = agent != null
        ? '${agent['firstName'] ?? ''} ${agent['lastName'] ?? ''}'.trim()
        : 'Unknown Agent';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFF703BF7).withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.person,
                  color: Color(0xFF703BF7),
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    agentName,
                    style: const TextStyle(
                      color: Color(0xFF703BF7),
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const Text(
                    'Real Estate Agent',
                    style: TextStyle(color: Colors.white38, fontSize: 11),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: List.generate(
              5,
              (i) => Icon(
                Icons.star,
                size: 16,
                color: i < rating ? const Color(0xFFFFD700) : Colors.white24,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '"${review['reviewText'] ?? ''}"',
            style: const TextStyle(
              color: Colors.white70,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            review['reviewerName'] ?? '',
            style: const TextStyle(color: Colors.white38, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
