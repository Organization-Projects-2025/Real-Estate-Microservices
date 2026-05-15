import 'dart:convert';
import 'package:http/http.dart' as http;

/// Central API service — all calls go through here.
/// Base URL points at the running NestJS API gateway.
class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';

  // ── Auth token (set after login/register) ──────────────────────────────────
  static String? _token;
  static Map<String, dynamic>? _currentUser;

  static String? get token => _token;
  static Map<String, dynamic>? get currentUser => _currentUser;

  static void setAuth(String token, Map<String, dynamic> user) {
    _token = token;
    _currentUser = user;
  }

  static void clearAuth() {
    _token = null;
    _currentUser = null;
  }

  static bool get isLoggedIn => _token != null;

  // ── Shared headers ─────────────────────────────────────────────────────────
  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  // ── Auth ───────────────────────────────────────────────────────────────────

  /// POST /api/auth/login
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _headers,
      body: jsonEncode({'email': email, 'password': password}),
    );
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    if (res.statusCode == 200 && body['status'] == 'success') {
      setAuth(body['data']['token'] as String,
          body['data']['user'] as Map<String, dynamic>);
    }
    return body;
  }

  /// POST /api/auth/register
  static Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    String role = 'user',
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _headers,
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password,
        'role': role,
      }),
    );
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    if ((res.statusCode == 200 || res.statusCode == 201) &&
        body['status'] == 'success') {
      setAuth(body['data']['token'] as String,
          body['data']['user'] as Map<String, dynamic>);
    }
    return body;
  }

  // ── Properties ─────────────────────────────────────────────────────────────

  /// GET /api/properties
  static Future<List<dynamic>> getProperties() async {
    final res = await http.get(
      Uri.parse('$baseUrl/properties'),
      headers: _headers,
    );
    if (res.statusCode == 200) {
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      return body['data']['properties'] as List<dynamic>? ?? [];
    }
    return [];
  }

  /// GET /api/properties/type/:listingType
  static Future<List<dynamic>> getPropertiesByType(String type) async {
    final res = await http.get(
      Uri.parse('$baseUrl/properties/type/$type'),
      headers: _headers,
    );
    if (res.statusCode == 200) {
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      return body['data']['properties'] as List<dynamic>? ?? [];
    }
    return [];
  }

  /// POST /api/properties
  static Future<Map<String, dynamic>> createProperty(
      Map<String, dynamic> data) async {
    final res = await http.post(
      Uri.parse('$baseUrl/properties'),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  // ── Agents ─────────────────────────────────────────────────────────────────

  /// GET /api/agents
  static Future<List<dynamic>> getAgents() async {
    final res = await http.get(
      Uri.parse('$baseUrl/agents'),
      headers: _headers,
    );
    if (res.statusCode == 200) {
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      return body['data']['agents'] as List<dynamic>? ?? [];
    }
    return [];
  }

  // ── Reviews ────────────────────────────────────────────────────────────────

  /// GET /api/reviews
  static Future<List<dynamic>> getReviews() async {
    final res = await http.get(
      Uri.parse('$baseUrl/reviews'),
      headers: _headers,
    );
    if (res.statusCode == 200) {
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      return body['data']['reviews'] as List<dynamic>? ?? [];
    }
    return [];
  }
}
