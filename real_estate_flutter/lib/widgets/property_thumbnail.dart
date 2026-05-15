import 'dart:typed_data';

import 'package:flutter/material.dart';

import '../services/local_thumbnail_service.dart';

class PropertyThumbnail extends StatelessWidget {
  final String path;
  final double height;
  final BorderRadius borderRadius;

  const PropertyThumbnail({
    super.key,
    required this.path,
    required this.height,
    required this.borderRadius,
  });

  bool get _isRemote =>
      path.startsWith('http://') || path.startsWith('https://');

  @override
  Widget build(BuildContext context) {
    if (path.trim().isEmpty) {
      return _placeholder();
    }

    if (_isRemote) {
      return Image.network(
        path,
        height: height,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => _placeholder(),
      );
    }

    return FutureBuilder<Uint8List?>(
      future: readThumbnailBytes(path),
      builder: (context, snapshot) {
        final bytes = snapshot.data;
        if (bytes == null || bytes.isEmpty) {
          return _placeholder();
        }
        return Image.memory(
          bytes,
          height: height,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) => _placeholder(),
        );
      },
    );
  }

  Widget _placeholder() => Container(
    height: height,
    decoration: BoxDecoration(
      color: const Color(0xFF252525),
      borderRadius: borderRadius,
    ),
    child: const Icon(Icons.home, color: Colors.white24, size: 40),
  );
}
