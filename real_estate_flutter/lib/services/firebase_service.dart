import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'dart:io';

class FirebaseService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final FirebaseStorage _storage = FirebaseStorage.instance;

  // ── Auth ───────────────────────────────────────────────────────────────
  static Future<UserCredential?> signUp(String email, String password) async {
    try {
      return await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Sign up error: $e');
      return null;
    }
  }

  static Future<UserCredential?> signIn(String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(
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
      await _auth.signOut();
    } catch (e) {
      print('Sign out error: $e');
    }
  }

  static User? getCurrentUser() {
    return _auth.currentUser;
  }

  static Stream<User?> authStateChanges() {
    return _auth.authStateChanges();
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
      await _firestore.collection('users').doc(uid).set({
        'email': email,
        'firstName': firstName,
        'lastName': lastName,
        'phone': phone,
        'profileImage': profileImage,
        'createdAt': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
    } catch (e) {
      print('Save user error: $e');
    }
  }

  static Future<DocumentSnapshot> getUserData(String uid) async {
    try {
      return await _firestore.collection('users').doc(uid).get();
    } catch (e) {
      print('Get user data error: $e');
      rethrow;
    }
  }

  static Future<void> updateUserData(String uid, Map<String, dynamic> data) async {
    try {
      await _firestore.collection('users').doc(uid).update(data);
    } catch (e) {
      print('Update user data error: $e');
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
      await _firestore.collection('properties').add({
        'title': title,
        'location': location,
        'type': type,
        'listingType': listingType,
        'image': image,
        'price': price,
        'beds': beds,
        'baths': baths,
        'sqft': sqft,
        'featured': featured,
        'description': description,
        'agentId': agentId,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Save property error: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getProperties() async {
    try {
      final snapshot = await _firestore.collection('properties').get();
      return snapshot.docs
          .map((doc) => {...doc.data(), 'id': doc.id})
          .toList();
    } catch (e) {
      print('Get properties error: $e');
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getPropertiesByType(String listingType) async {
    try {
      final snapshot = await _firestore
          .collection('properties')
          .where('listingType', isEqualTo: listingType)
          .get();
      return snapshot.docs
          .map((doc) => {...doc.data(), 'id': doc.id})
          .toList();
    } catch (e) {
      print('Get properties by type error: $e');
      return [];
    }
  }

  static Stream<QuerySnapshot> watchProperties() {
    return _firestore.collection('properties').snapshots();
  }

  static Future<void> updateProperty(String propertyId, Map<String, dynamic> data) async {
    try {
      await _firestore.collection('properties').doc(propertyId).update({
        ...data,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Update property error: $e');
    }
  }

  static Future<void> deleteProperty(String propertyId) async {
    try {
      await _firestore.collection('properties').doc(propertyId).delete();
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
      await _firestore.collection('agents').add({
        'name': name,
        'email': email,
        'phone': phone,
        'image': image,
        'role': role,
        'rating': rating,
        'deals': deals ?? 0,
        'createdAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Save agent error: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getAgents() async {
    try {
      final snapshot = await _firestore.collection('agents').get();
      return snapshot.docs
          .map((doc) => {...doc.data(), 'id': doc.id})
          .toList();
    } catch (e) {
      print('Get agents error: $e');
      return [];
    }
  }

  static Stream<QuerySnapshot> watchAgents() {
    return _firestore.collection('agents').snapshots();
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
      await _firestore.collection('reviews').add({
        'name': name,
        'rating': rating,
        'text': text,
        'date': date ?? DateTime.now().toString(),
        'agentId': agentId,
        'userId': userId,
        'createdAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Save review error: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getReviews() async {
    try {
      final snapshot = await _firestore.collection('reviews').get();
      return snapshot.docs
          .map((doc) => {...doc.data(), 'id': doc.id})
          .toList();
    } catch (e) {
      print('Get reviews error: $e');
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getReviewsByAgent(String agentId) async {
    try {
      final snapshot = await _firestore
          .collection('reviews')
          .where('agentId', isEqualTo: agentId)
          .get();
      return snapshot.docs
          .map((doc) => {...doc.data(), 'id': doc.id})
          .toList();
    } catch (e) {
      print('Get reviews by agent error: $e');
      return [];
    }
  }

  static Stream<QuerySnapshot> watchReviews() {
    return _firestore.collection('reviews').snapshots();
  }

  // ── Storage ────────────────────────────────────────────────────────────
  static Future<String?> uploadImage(String filePath, String fileName) async {
    try {
      final file = File(filePath);
      final ref = _storage.ref().child('images/$fileName');
      await ref.putFile(file);
      return await ref.getDownloadURL();
    } catch (e) {
      print('Upload image error: $e');
      return null;
    }
  }

  static Future<void> deleteImage(String imageUrl) async {
    try {
      await _storage.refFromURL(imageUrl).delete();
    } catch (e) {
      print('Delete image error: $e');
    }
  }
}
