import 'package:flutter/material.dart';

import '../services/firebase_service.dart';
import '../widgets/ui_blocks.dart';

class ReviewsPage extends StatefulWidget {
  const ReviewsPage({super.key});

  @override
  State<ReviewsPage> createState() => _ReviewsPageState();
}

class _ReviewsPageState extends State<ReviewsPage> {
  static const Color kPurple = Color(0xFF703BF7);
  static const Color kBg = Color(0xFF121212);
  static const Color kCard = Color(0xFF1A1A1A);

  bool loading = true;
  List<Map<String, dynamic>> reviews = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);
    try {
      final data = await FirebaseService.getReviews();
      if (!mounted) return;
      setState(() {
        reviews = data;
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
        onRefresh: _load,
        color: kPurple,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),
              ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: [kPurple, Colors.white],
                ).createShader(bounds),
                child: const Text(
                  'Reviews',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Discover what our clients have to say about their experience with our agents',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white54, fontSize: 14),
              ),
              const SizedBox(height: 28),
              if (loading)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 48),
                  child: Center(
                    child: CircularProgressIndicator(color: kPurple),
                  ),
                )
              else if (reviews.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 48),
                  child: Text(
                    'No reviews available yet.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white54),
                  ),
                )
              else
                ...reviews.map(
                  (review) => Padding(
                    padding: const EdgeInsets.only(bottom: 14),
                    child: ReviewCard(item: review),
                  ),
                ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Review form coming soon!'),
                      backgroundColor: kPurple,
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Write a Review',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
              ),
              const SizedBox(height: 32),
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
