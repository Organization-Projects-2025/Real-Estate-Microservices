import 'package:flutter/material.dart';

import '../services/firebase_service.dart';
import '../services/api_service.dart';

const Color kPurple = Color(0xFF703BF7);
const Color kBg = Color(0xFF121212);
const Color kCard = Color(0xFF1A1A1A);
const Color kInput = Color(0xFF252525);

class SignupPage extends StatefulWidget {
  final VoidCallback? onAuthChanged;

  const SignupPage({super.key, this.onAuthChanged});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final TextEditingController firstc = TextEditingController();
  final TextEditingController lastc = TextEditingController();
  final TextEditingController emailc = TextEditingController();
  final TextEditingController passc = TextEditingController();
  String role = 'user';
  bool loading = false;
  String message = '';
  bool isSuccess = false;

  @override
  void dispose() {
    firstc.dispose();
    lastc.dispose();
    emailc.dispose();
    passc.dispose();
    super.dispose();
  }

  Future<void> handleSubmit() async {
    if (firstc.text.trim().isEmpty ||
        emailc.text.trim().isEmpty ||
        passc.text.isEmpty) {
      setState(() {
        message = 'Please fill in all required fields';
        isSuccess = false;
      });
      return;
    }
    setState(() {
      loading = true;
      message = '';
    });

    try {
      final result = await FirebaseService.signUp(
        emailc.text.trim(),
        passc.text,
      );

      if (!mounted) return;

      if (result != null && result.user != null) {
        // Save user data to Firestore (may fail due to rules)
        await FirebaseService.saveUser(
          result.user!.uid,
          email: emailc.text.trim(),
          firstName: firstc.text.trim(),
          lastName: lastc.text.trim(),
          role: role,
        );

        if (role == 'agent') {
          await FirebaseService.saveAgent(
            name: '${firstc.text.trim()} ${lastc.text.trim()}',
            email: emailc.text.trim(),
            role: 'Property Agent',
            rating: 0.0,
            deals: 0,
          );
        }

        // Ensure the app shell knows we're logged in — use ApiService as the
        // UI currently relies on it for showing logged-in state.
        ApiService.setAuth(result.user!.uid, {
          'firstName': firstc.text.trim(),
          'lastName': lastc.text.trim(),
          'email': emailc.text.trim(),
          'role': role,
        });

        widget.onAuthChanged?.call();
        // Navigate to home and clear back stack so user lands on homepage
        Navigator.pushNamedAndRemoveUntil(context, '/home', (r) => false);
      } else {
        setState(() {
          message = 'Registration failed';
          isSuccess = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          message = 'Error: ${e.toString()}';
          isSuccess = false;
        });
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
                  height: 180,
                  width: double.infinity,
                  child: Image.network(
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) =>
                        Container(height: 180, color: const Color(0xFF1A1A1A)),
                  ),
                ),
                Container(
                  height: 180,
                  color: Colors.black.withValues(alpha: 0.6),
                ),
                const Positioned(
                  left: 0,
                  right: 0,
                  top: 55,
                  child: Text(
                    'Create Account',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: 1.5,
                    ),
                  ),
                ),
              ],
            ),

            // ── Form card ───────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: kCard,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: kPurple.withValues(alpha: 0.12),
                      blurRadius: 20,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (message.isNotEmpty) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isSuccess
                              ? Colors.green.withValues(alpha: 0.1)
                              : Colors.red.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSuccess
                                ? Colors.green.withValues(alpha: 0.3)
                                : Colors.red.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Text(
                          message,
                          style: TextStyle(
                            color: isSuccess
                                ? Colors.greenAccent
                                : Colors.redAccent,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // First + Last name
                    Row(
                      children: [
                        Expanded(
                          child: _Field(
                            label: 'First Name',
                            hint: 'First name',
                            controller: firstc,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _Field(
                            label: 'Last Name',
                            hint: 'Last name',
                            controller: lastc,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    _Field(
                      label: 'Email',
                      hint: 'Enter your email',
                      controller: emailc,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 14),

                    _Field(
                      label: 'Password',
                      hint: 'Enter your password',
                      controller: passc,
                      obscure: true,
                    ),
                    const SizedBox(height: 14),

                    // Account type
                    const Text(
                      'Account Type',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Colors.white70,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: kInput,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: role,
                          dropdownColor: kInput,
                          style: const TextStyle(color: Colors.white),
                          items: const [
                            DropdownMenuItem(
                              value: 'user',
                              child: Text('Property User'),
                            ),
                            DropdownMenuItem(
                              value: 'developer',
                              child: Text('Property Developer'),
                            ),
                            DropdownMenuItem(
                              value: 'agent',
                              child: Text('Property Agent'),
                            ),
                          ],
                          onChanged: (v) => setState(() => role = v ?? 'user'),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      role == 'developer'
                          ? 'As a developer, you can list and manage your own properties'
                          : role == 'agent'
                              ? 'As an agent, you can represent properties and connect with clients'
                              : 'As a user, you can browse and inquire about properties',
                      style: const TextStyle(
                        color: Colors.white38,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 20),

                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.04),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'Password must be 8+ chars with uppercase, lowercase, number & special character.',
                        style: TextStyle(color: Colors.white38, fontSize: 12),
                      ),
                    ),
                    const SizedBox(height: 20),

                    SizedBox(
                      height: 50,
                      child: ElevatedButton(
                        onPressed: loading ? null : handleSubmit,
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
                                'Register',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Already have an account? ',
                          style: TextStyle(color: Colors.white54, fontSize: 13),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Text(
                            'Log In',
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
}

// ── Reusable field ────────────────────────────────────────────────────────────
class _Field extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final bool obscure;
  final TextInputType keyboardType;

  const _Field({
    required this.label,
    required this.hint,
    required this.controller,
    this.obscure = false,
    this.keyboardType = TextInputType.text,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Colors.white70,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          obscureText: obscure,
          keyboardType: keyboardType,
          style: const TextStyle(color: Colors.white),
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
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 14,
              vertical: 14,
            ),
          ),
        ),
      ],
    );
  }
}
