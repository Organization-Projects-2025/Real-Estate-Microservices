import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static final supabase = Supabase.instance.client;

  // ── Auth ───────────────────────────────────────────────────────────────
  static Future<AuthResponse?> signUp(String email, String password) async {
    try {
      return await supabase.auth.signUp(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Sign up error: $e');
      return null;
    }
  }

  static Future<AuthResponse?> signIn(String email, String password) async {
    try {
      return await supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Sign in error: $e');
      return null;
    }
  }

  static Future<void> signOut() async {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      print('Sign out error: $e');
    }
  }

  static User? getCurrentUser() {
    return supabase.auth.currentUser;
  }

  static Stream<AuthState> authStateChanges() {
    return supabase.auth.onAuthStateChange;
  }

  // ── Users ──────────────────────────────────────────────────────────────
  static Future<void> saveUser(String uid, {
    required String email,
    String? firstName,
    String? lastName,
    String? phone,
    String? profileImage,
  }) async {
    try {
      await supabase.from('users').upsert({
        'id': uid,
        'email': email,
        'first_name': firstName,
        'last_name': lastName,
        'phone': phone,
        'profile_image': profileImage,
      });
    } catch (e) {
      print('Save user error: $e');
    }
  }

  static Future<Map<String, dynamic>?> getUser(String uid) async {
    try {
      final response = await supabase
          .from('users')
          .select()
          .eq('id', uid)
          .single();
      return response;
    } catch (e) {
      print('Get user error: $e');
      return null;
    }
  }

  // ── Properties ─────────────────────────────────────────────────────────
  static Future<void> saveProperty({
    required String title,
    required String location,
    required String type,
    required String listingType,
    required String image,
    required int price,
    int? beds,
    int? baths,
    int? sqft,
    bool featured = false,
    String? description,
    String? agentId,
  }) async {
    try {
      await supabase.from('properties').insert({
        'title': title,
        'location': location,
        'type': type,
        'listing_type': listingType,
        'image': image,
        'price': price,
        'beds': beds,
        'baths': baths,
        'sqft': sqft,
        'featured': featured,
        'description': description,
        'agent_id': agentId,
      });
    } catch (e) {
      print('Save property error: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getProperties() async {
    try {
      final response = await supabase.from('properties').select();
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Get properties error: $e');
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getPropertiesByType(String listingType) async {
    try {
      final response = await supabase
          .from('properties')
          .select()
          .eq('listing_type', listingType);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Get properties by type error: $e');
      return [];
    }
  }

  static Stream<List<Map<String, dynamic>>> watchProperties() {
    return supabase
        .from('properties')
        .stream(primaryKey: ['id'])
        .map((data) => List<Map<String, dynamic>>.from(data));
  }

  static Future<void> updateProperty(String propertyId, Map<String, dynamic> data) async {
    try {
      await supabase
          .from('properties')
          .update(data)
          .eq('id', propertyId);
    } catch (e) {
      print('Update property error: $e');
    }
  }

  static Future<void> deleteProperty(String propertyId) async {
    try {
      await supabase
          .from('properties')
          .delete()
          .eq('id', propertyId);
    } catch (e) {
      print('Delete property error: $e');
    }
  }

  // ── Agents ─────────────────────────────────────────────────────────────
  static Future<void> saveAgent({
    required String name,
    required String email,
    String? phone,
    String? image,
    String? role,
    double? rating,
    int? deals,
  }) async {
    try {
      await supabase.from('agents').insert({
        'name': name,
        'email': email,
        'phone': phone,
        'image': image,
        'role': role,
        'rating': rating,
        'deals': deals ?? 0,
      });
    } catch (e) {
      print('Save agent error: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getAgents() async {
    try {
      final response = await supabase.from('agents').select();
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Get agents error: $e');
      return [];
    }
  }

  static Stream<List<Map<String, dynamic>>> watchAgents() {
    return supabase
        .from('agents')
        .stream(primaryKey: ['id'])
        .map((data) => List<Map<String, dynamic>>.from(data));
  }

  // ── Reviews ────────────────────────────────────────────────────────────
  static Future<void> saveReview({
    required String name,
    required int rating,
    required String text,
    String? date,
    String? agentId,
    String? userId,
  }) async {
    try {
      await supabase.from('reviews').insert({
        'name': name,
        'rating': rating,
        'text': text,
        'date': date ?? DateTime.now().toString(),
        'agent_id': agentId,
        'user_id': userId,
      });
    } catch (e) {
      print('Save review error: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getReviews() async {
    try {
      final response = await supabase.from('reviews').select();
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Get reviews error: $e');
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getReviewsByAgent(String agentId) async {
    try {
      final response = await supabase
          .from('reviews')
          .select()
          .eq('agent_id', agentId);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Get reviews by agent error: $e');
      return [];
    }
  }

  static Stream<List<Map<String, dynamic>>> watchReviews() {
    return supabase
        .from('reviews')
        .stream(primaryKey: ['id'])
        .map((data) => List<Map<String, dynamic>>.from(data));
  }
}
