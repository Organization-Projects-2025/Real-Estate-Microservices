import 'package:flutter/material.dart';

import '../services/firebase_service.dart';

class AboutUsPage extends StatefulWidget {
  const AboutUsPage({super.key});

  @override
  State<AboutUsPage> createState() => _AboutUsPageState();
}

class _AboutUsPageState extends State<AboutUsPage> {
  static const Color kPurple = Color(0xFF703BF7);
  static const Color kBg = Color(0xFF121212);
  static const Color kCard = Color(0xFF1A1A1A);

  bool loading = true;
  Map<String, String> stats = const {
    'Properties Sold': '0+',
    'Happy Clients': '0+',
    'Cities Covered': '0+',
  };

  static const List<Map<String, String>> values = [
    {
      'icon': 'trust',
      'title': 'Trust & Transparency',
      'desc':
          'We believe every client deserves honest, clear communication at every step.',
    },
    {
      'icon': 'innovation',
      'title': 'Innovation',
      'desc':
          'We leverage technology to make property search faster and smarter.',
    },
    {
      'icon': 'community',
      'title': 'Community',
      'desc':
          'We invest in the neighborhoods we serve, building lasting relationships.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    setState(() => loading = true);
    try {
      final siteStats = await FirebaseService.getSiteStats();
      if (!mounted) return;
      setState(() {
        stats = {
          'Properties Sold': '${siteStats['propertiesSold'] ?? 0}+',
          'Happy Clients': '${siteStats['happyClients'] ?? 0}+',
          'Cities Covered': '${siteStats['citiesCovered'] ?? 0}+',
        };
        loading = false;
      });
    } catch (_) {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: RefreshIndicator(
        onRefresh: _loadStats,
        color: kPurple,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Stack(
                children: [
                  SizedBox(
                    height: 240,
                    width: double.infinity,
                    child: Image.network(
                      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
                      fit: BoxFit.cover,
                    ),
                  ),
                  Container(
                    height: 240,
                    color: Colors.black.withValues(alpha: 0.6),
                  ),
                  const Positioned(
                    left: 24,
                    right: 24,
                    top: 70,
                    child: Column(
                      children: [
                        Text(
                          'About Tamalak',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 10),
                        Text(
                          'Your trusted real estate partner since 2020',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white70, fontSize: 15),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              Container(
                color: kCard,
                padding: const EdgeInsets.symmetric(
                  vertical: 20,
                  horizontal: 16,
                ),
                child: loading
                    ? const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Center(
                          child: CircularProgressIndicator(color: kPurple),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: stats.entries
                            .map(
                              (entry) => Column(
                                children: [
                                  Text(
                                    entry.value,
                                    style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: kPurple,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    entry.key,
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
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 32, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Our Story',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: kCard,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: const Text(
                        'Tamalak was founded with a simple mission: make finding your perfect home as easy and transparent as possible. '
                        'We started as a small team of real estate enthusiasts and have grown into a platform trusted by buyers, '
                        'sellers, and renters across multiple cities. Our agents are carefully vetted professionals who put your needs first.',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                          height: 1.6,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Our Values',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 14),
                    ...values.map(
                      (v) => Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: kCard,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.white10),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: kPurple.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.star,
                                color: kPurple,
                                size: 22,
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    v['title']!,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    v['desc']!,
                                    style: const TextStyle(
                                      color: Colors.white54,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Meet the Team',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'Our diverse team of real estate professionals, engineers, and designers work together to deliver the best property experience.',
                      style: TextStyle(
                        color: Colors.white54,
                        fontSize: 14,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      height: 46,
                      child: ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: kPurple,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Join Our Team'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
