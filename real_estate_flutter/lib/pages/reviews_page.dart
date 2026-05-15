import 'package:flutter/material.dart';

import '../data/mock_data.dart';
import '../widgets/ui_blocks.dart';

class ReviewsPage extends StatelessWidget {
  const ReviewsPage({super.key});

  static const Color kPurple = Color(0xFF703BF7);
  static const Color kBg = Color(0xFF121212);
  static const Color kCard = Color(0xFF1A1A1A);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: SingleChildScrollView(
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
            ...mockReviews.map(
              (r) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: ReviewCard(item: r),
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
    );
  }
}
