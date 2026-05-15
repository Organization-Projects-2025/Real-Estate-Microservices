import 'package:flutter/material.dart';

import 'property_thumbnail.dart';

/// Property card that works with raw API JSON maps.
class ApiPropertyCard extends StatelessWidget {
  final dynamic property;
  const ApiPropertyCard({super.key, required this.property});

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
    final priceLabel = listingType == 'rent' ? '\$$price /mo' : '\$$price';

    return Container(
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
                Row(
                  children: [
                    const Icon(
                      Icons.location_on,
                      color: Colors.white38,
                      size: 14,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        '${address['city'] ?? ''}, ${address['state'] ?? ''}',
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 12,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  priceLabel,
                  style: const TextStyle(
                    color: kPurple,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${property['listingType']?.toString().toUpperCase() ?? ''} · ${property['subType'] ?? ''}',
                  style: const TextStyle(color: Colors.white38, fontSize: 11),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    _chip(Icons.bed, '${features['bedrooms'] ?? 0} Beds'),
                    const SizedBox(width: 8),
                    _chip(
                      Icons.bathtub_outlined,
                      '${features['bathrooms'] ?? 0} Baths',
                    ),
                    const SizedBox(width: 8),
                    _chip(Icons.square_foot, '${area['sqft'] ?? 0} sqft'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _chip(IconData icon, String text) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Icon(icon, size: 13, color: Colors.white38),
      const SizedBox(width: 4),
      Text(text, style: const TextStyle(color: Colors.white54, fontSize: 11)),
    ],
  );
}
