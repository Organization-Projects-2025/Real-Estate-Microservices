import 'package:flutter/material.dart';

import '../services/firebase_service.dart';
import '../services/api_service.dart';
import 'signup_page.dart';

const Color kPurple = Color(0xFF703BF7);
const Color kBg = Color(0xFF121212);
const Color kCard = Color(0xFF1A1A1A);
const Color kInput = Color(0xFF2A2A2A);

class LoginPage extends StatefulWidget {
  /// Called after a successful login so the parent shell can rebuild.
  final VoidCallback? onAuthChanged;

  const LoginPage({super.key, this.onAuthChanged});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController emailc = TextEditingController();
  final TextEditingController passc = TextEditingController();
  bool loading = false;
  String error = '';

  @override
  void dispose() {
    emailc.dispose();
    passc.dispose();
    super.dispose();
  }

  Future<void> handleLogin() async {
    if (emailc.text.trim().isEmpty || passc.text.isEmpty) {
      setState(() => error = 'Please enter both email and password');
      return;
    }
    setState(() {
      loading = true;
      error = '';
    });

    try {
      final result = await FirebaseService.signIn(
        emailc.text.trim(),
        passc.text,
      );

      if (!mounted) return;

      if (result != null) {
        // Populate ApiService current user so the shell reflects login state.
        try {
          ApiService.setAuth(result.user!.uid, {
            'email': result.user?.email ?? '',
            'firstName': result.user?.displayName ?? '',
            'lastName': '',
            'role': 'user',
          });
        } catch (_) {}

        widget.onAuthChanged?.call();
        Navigator.pop(context); // go back to HomePage
      } else {
        setState(() {
          error = 'Login failed. Please check your credentials.';
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => error = 'Error: ${e.toString()}');
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      appBar: AppBar(
        backgroundColor: kBg,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // ── Hero strip ──────────────────────────────────────────────────
            Stack(
              children: [
                SizedBox(
                  height: 220,
                  width: double.infinity,
                  child: Image.network(
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) =>
                        Container(height: 220, color: const Color(0xFF1A1A1A)),
                  ),
                ),
                Container(
                  height: 220,
                  color: Colors.black.withValues(alpha: 0.55),
                ),
                const Positioned(
                  left: 0,
                  right: 0,
                  top: 60,
                  child: Column(
                    children: [
                      Text(
                        'Tamalak',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 38,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 2,
                        ),
                      ),
                      SizedBox(height: 6),
                      Text(
                        'Agents. Tours. Loans. Homes.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white70, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // ── Form card ───────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
              child: Container(
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  color: kCard,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: kPurple.withValues(alpha: 0.15),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    ShaderMask(
                      shaderCallback: (b) => const LinearGradient(
                        colors: [kPurple, Colors.white],
                      ).createShader(b),
                      child: const Text(
                        'Login',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    if (error.isNotEmpty) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: Colors.red.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Text(
                          error,
                          style: const TextStyle(color: Colors.redAccent),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    _label('Email'),
                    const SizedBox(height: 6),
                    _inputField(
                      controller: emailc,
                      hint: 'Enter your email',
                      type: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 16),

                    _label('Password'),
                    const SizedBox(height: 6),
                    _inputField(
                      controller: passc,
                      hint: 'Enter your password',
                      obscure: true,
                    ),
                    const SizedBox(height: 24),

                    SizedBox(
                      height: 50,
                      child: ElevatedButton(
                        onPressed: loading ? null : handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: kPurple,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: loading
                            ? const SizedBox(
                                width: 22,
                                height: 22,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2.5,
                                ),
                              )
                            : const Text(
                                'Login',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Don't have an account? ",
                          style: TextStyle(color: Colors.white54, fontSize: 13),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (_) => SignupPage(
                                onAuthChanged: widget.onAuthChanged,
                              ),
                            ),
                          ),
                          child: const Text(
                            'Sign up here',
                            style: TextStyle(
                              color: kPurple,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Text(
                '© 2025 Tamalak. All Rights Reserved.',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.3),
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _label(String text) => Text(
    text,
    style: const TextStyle(
      fontSize: 13,
      fontWeight: FontWeight.w500,
      color: Colors.white70,
    ),
  );

  Widget _inputField({
    required TextEditingController controller,
    required String hint,
    bool obscure = false,
    TextInputType type = TextInputType.text,
  }) => TextField(
    controller: controller,
    obscureText: obscure,
    keyboardType: type,
    style: const TextStyle(color: Colors.white),
    onSubmitted: (_) => handleLogin(),
    decoration: InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.white38),
      filled: true,
      fillColor: kInput,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: kPurple, width: 2),
      ),
    ),
  );
}

// ── Signup page import shim removed — imported at top
