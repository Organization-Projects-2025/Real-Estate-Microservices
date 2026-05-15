import 'package:flutter/foundation.dart';

import 'firebase_service.dart';

class ApiService {
  static String? _token;
  static Map<String, dynamic>? _currentUser;

  static String? get token => _token;
  static Map<String, dynamic>? get currentUser => _currentUser;
  static bool get isLoggedIn {
    try {
      return FirebaseService.getCurrentUser() != null || _token != null;
    } catch (_) {
      return _token != null;
    }
  }

  static void setAuth(String token, Map<String, dynamic> user) {
    _token = token;
    _currentUser = user;
  }

  static void clearAuth() {
    _token = null;
    _currentUser = null;
  }

  static Map<String, dynamic> _asApiProperty(
    Map<String, dynamic> source, {
    String? fallbackListingType,
  }) {
    final address = source['address'] as Map? ?? {};
    final features = source['features'] as Map? ?? {};
    final area = source['area'] as Map? ?? {};
    final media = source['media'] as List? ?? const [];
    final location = (source['location'] ?? '').toString();
    final thumbnailPath = (source['thumbnailPath'] ?? source['image'] ?? '')
        .toString();
    final listingType = (source['listingType'] ?? fallbackListingType ?? 'sale')
        .toString();

    final city = address['city']?.toString().isNotEmpty == true
        ? address['city'].toString()
        : (location.contains(',') ? location.split(',').first : location);
    final state = address['state']?.toString().isNotEmpty == true
        ? address['state'].toString()
        : (location.contains(',') ? location.split(',').last.trim() : '');

    return {
      'id': source['id'],
      'title': source['title'] ?? '',
      'subType': source['subType'] ?? source['type'] ?? '',
      'listingType': listingType,
      'price': source['price'] ?? 0,
      'media': media.isNotEmpty
          ? media.map((item) => item.toString()).toList()
          : [thumbnailPath]
                .where((item) => item.toString().isNotEmpty)
                .map((item) => item.toString())
                .toList(),
      'thumbnailPath': thumbnailPath,
      'address': {'city': city, 'state': state},
      'features': {
        'bedrooms':
            features['bedrooms'] ?? source['beds'] ?? source['bedrooms'] ?? 0,
        'bathrooms':
            features['bathrooms'] ??
            source['baths'] ??
            source['bathrooms'] ??
            0,
      },
      'area': {'sqft': area['sqft'] ?? source['sqft'] ?? 0},
      'featured': source['featured'] ?? false,
    };
  }

  static String _normalizeListingType(String type) {
    switch (type) {
      case 'sale':
      case 'buy':
        return 'sale';
      case 'rent':
        return 'rent';
      default:
        return type;
    }
  }

  static String _firstString(List? values) {
    if (values == null || values.isEmpty) return '';
    final first = values.first;
    return first == null ? '' : first.toString();
  }

  // Auth
  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    final result = await FirebaseService.signIn(email, password);
    if (result?.user == null) {
      return {
        'status': 'error',
        'message':
            'Login failed. Check your credentials or enable Email/Password auth in Firebase.',
      };
    }

    final user = {
      'uid': result!.user!.uid,
      'email': result.user!.email ?? email,
      'firstName': result.user!.displayName ?? '',
      'lastName': '',
      'role': 'user',
    };
    setAuth(result.user!.uid, user);
    return {
      'status': 'success',
      'data': {'token': result.user!.uid, 'user': user},
    };
  }

  static Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    String role = 'user',
  }) async {
    final result = await FirebaseService.signUp(email, password);
    if (result?.user == null) {
      return {
        'status': 'error',
        'message': 'Registration failed. Check Firebase Auth settings.',
      };
    }

    final user = {
      'uid': result!.user!.uid,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
    };

    await FirebaseService.saveUser(
      result.user!.uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
    );
    setAuth(result.user!.uid, user);
    return {
      'status': 'success',
      'data': {'token': result.user!.uid, 'user': user},
    };
  }

  // Properties
  static Future<List<dynamic>> getProperties() async {
    try {
      final remote = await FirebaseService.getProperties();
      return remote.map((doc) => _asApiProperty(doc)).toList();
    } catch (e) {
      debugPrint('Get properties via Firebase failed: $e');
      return const [];
    }
  }

  static Future<List<dynamic>> getPropertiesByType(String type) async {
    final queryType = _normalizeListingType(type);
    try {
      final remote = await FirebaseService.getPropertiesByType(queryType);
      return remote
          .map((doc) => _asApiProperty(doc, fallbackListingType: queryType))
          .toList();
    } catch (e) {
      debugPrint('Get properties by type via Firebase failed: $e');
      return const [];
    }
  }

  static Future<Map<String, dynamic>> createProperty(
    Map<String, dynamic> data,
  ) async {
    try {
      final address = data['address'] as Map? ?? {};
      final features = data['features'] as Map? ?? {};
      final area = data['area'] as Map? ?? {};
      final media = data['media'] as List? ?? const [];

      final listingType = _normalizeListingType(
        (data['listingType'] ?? 'sale').toString(),
      );
      final image = _firstString(media).isNotEmpty
          ? _firstString(media)
          : (data['image'] ?? '').toString();
      final location =
          [
                address['street'],
                address['city'],
                address['state'],
                address['country'],
              ]
              .where((part) => (part ?? '').toString().trim().isNotEmpty)
              .map((part) => part.toString().trim())
              .join(', ');

      await FirebaseService.saveProperty(
        title: (data['title'] ?? '').toString(),
        location: location,
        type: (data['type'] ?? data['subType'] ?? '').toString(),
        listingType: listingType,
        image: image,
        thumbnailPath: (data['thumbnailPath'] ?? image).toString(),
        price: data['price'] ?? 0,
        beds: features['bedrooms'] ?? data['beds'],
        baths: features['bathrooms'] ?? data['baths'],
        sqft: area['sqft'] ?? data['sqft'],
        featured: data['featured'] ?? false,
        description: (data['description'] ?? '').toString(),
        agentId: data['agentId']?.toString(),
      );

      final payload = _asApiProperty({
        ...data,
        'listingType': listingType,
        'location': location,
        'image': image,
      });
      return {'status': 'success', 'data': payload};
    } catch (e) {
      return {'status': 'error', 'message': e.toString()};
    }
  }

  // Agents
  static Future<List<dynamic>> getAgents() async {
    try {
      return await FirebaseService.getAgents();
    } catch (e) {
      debugPrint('Get agents via Firebase failed: $e');
      return const [];
    }
  }

  // Reviews
  static Future<List<dynamic>> getReviews() async {
    try {
      return await FirebaseService.getReviews();
    } catch (e) {
      debugPrint('Get reviews via Firebase failed: $e');
      return const [];
    }
  }
}
